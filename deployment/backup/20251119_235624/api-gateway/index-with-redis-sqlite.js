const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Load Redis client
let redis;
try {
    redis = require('../../../libs/redis/client');
    console.log('✅ Redis client loaded');
} catch (error) {
    console.log('⚠️  Redis not available, using mock');
    redis = { isConnected: false, async set() {}, async get() { return null; } };
}

// Load SQLite database routes
const databaseRoutes = require('./routes/database');
const { cacheMiddleware } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 8102;

// Middleware
app.use(cors());
app.use(express.json());

// AI Agent URL
const AI_AGENT_URL = 'http://127.0.0.1:8100/chat';
const BI_API_URL = 'http://127.0.0.1:8101/api/alerts';

// Enhanced health check with both Redis and SQLite status
app.get('/health', async (req, res) => {
    try {
        const redisStatus = redis.isConnected ? 'connected' : 'disconnected';
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
        
        // Test Redis connection
        if (redis.isConnected) {
            await redis.set('health-check', Date.now(), 10);
            const timestamp = await redis.get('health-check');
            const redisInfo = await redis.info();
            
            res.json({
                status: 'healthy',
                services: {
                    api_gateway: `http://localhost:${PORT}`,
                    redis: redisStatus,
                    sqlite: sqliteStatus,
                    ai_agent: AI_AGENT_URL,
                    bi_api: BI_API_URL
                },
                redis_info: redisInfo,
                database_info: dbHealth,
                cache: 'enabled',
                persistence: sqliteStatus === 'connected' ? 'enabled' : 'disabled'
            });
        } else {
            res.json({
                status: 'healthy',
                services: {
                    api_gateway: `http://localhost:${PORT}`,
                    redis: redisStatus,
                    sqlite: sqliteStatus,
                    ai_agent: AI_AGENT_URL,
                    bi_api: BI_API_URL
                },
                database_info: dbHealth,
                cache: 'disabled',
                persistence: sqliteStatus === 'connected' ? 'enabled' : 'disabled'
            });
        }
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

// Enhanced cached endpoints with SQLite analytics
app.get('/api/cache/stats', cacheMiddleware(60), async (req, res) => {
    try {
        const redisInfo = await redis.info();
        let dbStats = {};
        
        try {
            const dbResponse = await fetch(`http://localhost:${PORT}/api/db/analytics/cache`);
            if (dbResponse.ok) {
                dbStats = await dbResponse.json();
            }
        } catch (error) {
            console.log('⚠️  Could not fetch database analytics');
        }
        
        const stats = {
            timestamp: Date.now(),
            redis: {
                connected: redis.isConnected,
                info: redisInfo
            },
            database: dbStats,
            memory_usage: process.memoryUsage()
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User data endpoint (cached with database persistence)
app.get('/api/users', cacheMiddleware(120), async (req, res) => {
    try {
        // This would normally fetch from database
        // For now, return mock data that would come from SQLite
        const users = [
            { id: 1, username: 'admin', email: 'admin@humbu.store' },
            { id: 2, username: 'user1', email: 'user1@humbu.store' }
        ];
        res.json({ users, source: 'cache_with_database_backend' });
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

// Enhanced cache test with analytics
app.get('/api/cache/test', cacheMiddleware(30), async (req, res) => {
    const testData = {
        message: 'This is cached data with SQLite analytics',
        timestamp: Date.now(),
        random: Math.random(),
        source: 'redis_cache',
        analytics: 'stored_in_sqlite'
    };
    res.json(testData);
});

// Initialize services on startup
async function initializeServices() {
    try {
        await redis.connect();
        console.log('✅ Redis cache layer initialized');
    } catch (error) {
        console.log('⚠️  Redis not available, running without cache');
    }
    
    console.log('✅ SQLite database routes mounted');
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 API Gateway with Redis + SQLite running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🗃️  Database API: http://localhost:${PORT}/api/db`);
    console.log(`🔗 AI Agent: ${AI_AGENT_URL}`);
    console.log(`📊 BI API: ${BI_API_URL}`);
    console.log(`💾 Cache test: http://localhost:${PORT}/api/cache/test`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    
    await initializeServices();
});

module.exports = app;
