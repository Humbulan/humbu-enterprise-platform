const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Load all services
let redis, kafka, sqlite;
try {
    redis = require('../../../libs/redis/client');
    console.log('✅ Redis client loaded');
} catch (error) {
    console.log('⚠️  Redis not available, using mock');
    redis = { isConnected: false, async set() {}, async get() { return null; } };
}

try {
    kafka = require('../../../libs/kafka/client');
    console.log('✅ Kafka client loaded');
} catch (error) {
    console.log('⚠️  Kafka not available, using mock');
    kafka = { isConnected: false, async produce() {}, async consume() {} };
}

try {
    sqlite = require('../../../libs/sqlite/client');
    console.log('✅ SQLite client loaded');
} catch (error) {
    console.log('⚠️  SQLite not available, using mock');
    sqlite = { isConnected: false };
}

// Load event handlers and consumers
const UserEvents = require('./events/UserEvents');
const CacheEvents = require('./events/CacheEvents');
const ApiEvents = require('./events/ApiEvents');
const MetricsConsumer = require('./consumers/MetricsConsumer');
const NotificationConsumer = require('./consumers/NotificationConsumer');
const databaseRoutes = require('./routes/database');
const { cacheMiddleware, clearCache } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 8102;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced middleware with Kafka events
app.use((req, res, next) => {
    const start = Date.now();
    
    // Log API request
    ApiEvents.requestReceived(req.method, req.path, req.ip, req.get('User-Agent'));
    
    // Override res.json to track responses
    const originalJson = res.json;
    res.json = function(data) {
        const responseTime = Date.now() - start;
        ApiEvents.responseSent(req.method, req.path, res.statusCode, responseTime);
        originalJson.call(this, data);
    };
    
    next();
});

// AI Agent URL
const AI_AGENT_URL = 'http://127.0.0.1:8100/chat';
const BI_API_URL = 'http://127.0.0.1:8101/api/alerts';

// Ultimate health check with all services
app.get('/health', async (req, res) => {
    try {
        const redisStatus = redis.isConnected ? 'connected' : 'disconnected';
        const kafkaStatus = kafka.isConnected ? 'connected' : 'disconnected';
        let sqliteStatus = 'unknown';
        let dbHealth = {};
        
        try {
            const dbResponse = await fetch(`http://localhost:${PORT}/api/db/health`);
            if (dbResponse.ok) {
                dbHealth = await dbResponse.json();
                sqliteStatus = dbHealth.status === 'healthy' ? 'connected' : 'error';
            } else {
                sqliteStatus = 'error';
            }
        } catch (error) {
            sqliteStatus = 'error';
            dbHealth = { error: error.message };
        }
        
        // Get Kafka stats
        const kafkaStats = await kafka.getStats ? await kafka.getStats() : { topics: 0, producers: 0, consumers: 0 };
        
        res.json({
            status: 'healthy',
            services: {
                api_gateway: `http://localhost:${PORT}`,
                redis: redisStatus,
                kafka: kafkaStatus,
                sqlite: sqliteStatus,
                ai_agent: AI_AGENT_URL,
                bi_api: BI_API_URL
            },
            kafka: kafkaStats,
            database_info: dbHealth,
            cache: redisStatus === 'connected' ? 'enabled' : 'disabled',
            persistence: sqliteStatus === 'connected' ? 'enabled' : 'disabled',
            event_streaming: kafkaStatus === 'connected' ? 'enabled' : 'disabled'
        });
    } catch (error) {
        res.status(500).json({
            status: 'degraded',
            error: error.message,
            services: {
                api_gateway: `http://localhost:${PORT}`,
                ai_agent: AI_AGENT_URL,
                bi_api: BI_API_URL
            }
        });
    }
});

// Database routes
app.use('/api/db', databaseRoutes);

// Enhanced cached endpoints with Kafka events
app.get('/api/cache/stats', cacheMiddleware(60), async (req, res) => {
    try {
        const redisInfo = redis.isConnected ? await redis.info() : {};
        let dbStats = {};
        let kafkaStats = {};
        
        try {
            const dbResponse = await fetch(`http://localhost:${PORT}/api/db/analytics/cache`);
            if (dbResponse.ok) {
                dbStats = await dbResponse.json();
            }
        } catch (error) {
            console.log('⚠️  Could not fetch database analytics');
        }
        
        try {
            kafkaStats = await kafka.getStats ? await kafka.getStats() : {};
        } catch (error) {
            console.log('⚠️  Could not fetch Kafka stats');
        }
        
        const stats = {
            timestamp: Date.now(),
            redis: {
                connected: redis.isConnected,
                info: redisInfo
            },
            kafka: kafkaStats,
            database: dbStats,
            memory_usage: process.memoryUsage()
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User management with Kafka events
app.post('/api/users', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        // In real implementation, this would create user in database
        const userData = { id: Date.now(), username, email };
        
        // Send Kafka event
        await UserEvents.userCreated(userData);
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: userData,
            event_sent: true
        });
    } catch (error) {
        ApiEvents.errorOccurred('POST', '/api/users', error, 500);
        res.status(500).json({ error: error.message });
    }
});

// Enhanced cache test with Kafka events
app.get('/api/cache/test', cacheMiddleware(30), async (req, res) => {
    const start = Date.now();
    
    const testData = {
        message: 'This is cached data with Kafka event streaming',
        timestamp: Date.now(),
        random: Math.random(),
        source: 'redis_cache',
        analytics: 'stored_in_sqlite',
        events: 'streamed_via_kafka'
    };
    
    // Send cache event
    const responseTime = Date.now() - start;
    await CacheEvents.cacheHit('/api/cache/test', 'cache_test_key', responseTime);
    
    res.json(testData);
});

// Kafka management endpoints
app.get('/api/kafka/topics', async (req, res) => {
    try {
        const topics = await kafka.getTopics ? await kafka.getTopics() : [];
        res.json({ topics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/kafka/events/test', async (req, res) => {
    try {
        const { topic, message } = req.body;
        
        await kafka.produce(topic || 'test-events', message || { 
            type: 'TEST_EVENT',
            message: 'This is a test Kafka event',
            timestamp: new Date().toISOString()
        });
        
        res.json({ 
            message: 'Test event sent successfully',
            topic: topic || 'test-events'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy middleware
const aiProxy = createProxyMiddleware({
    target: AI_AGENT_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/ai': '/chat'
    }
});

const biProxy = createProxyMiddleware({
    target: BI_API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/bi': '/api/alerts'
    }
});

// Routes
app.use('/api/ai', aiProxy);
app.use('/api/bi', biProxy);

// Initialize all services
async function initializeServices() {
    try {
        await redis.connect();
        console.log('✅ Redis cache layer initialized');
    } catch (error) {
        console.log('⚠️  Redis not available, running without cache');
    }
    
    try {
        await kafka.connect();
        console.log('✅ Kafka event streaming initialized');
        
        // Start Kafka consumers
        await MetricsConsumer.start();
        await NotificationConsumer.start();
        console.log('✅ Kafka consumers started');
    } catch (error) {
        console.log('⚠️  Kafka not available, running without event streaming');
    }
    
    console.log('✅ SQLite database routes mounted');
    console.log('✅ All services initialized successfully');
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 ULTIMATE API GATEWAY running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🗃️  Database API: http://localhost:${PORT}/api/db`);
    console.log(`📨 Kafka API: http://localhost:${PORT}/api/kafka`);
    console.log(`🔗 AI Agent: ${AI_AGENT_URL}`);
    console.log(`📊 BI API: ${BI_API_URL}`);
    console.log(`💾 Cache test: http://localhost:${PORT}/api/cache/test`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    
    await initializeServices();
});

module.exports = app;
