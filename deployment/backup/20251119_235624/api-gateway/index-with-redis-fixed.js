const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Try different paths for Redis client
let redis;
try {
    // Try the main path first
    redis = require('../../../libs/redis/client');
    console.log('✅ Redis client loaded from main path');
} catch (error) {
    console.log('⚠️  Main path failed, trying alternative paths...');
    try {
        // Try relative path
        redis = require('./../../libs/redis/client');
        console.log('✅ Redis client loaded from relative path');
    } catch (error2) {
        console.log('❌ All Redis paths failed, running without cache');
        // Create a mock redis client
        redis = {
            isConnected: false,
            async connect() { 
                this.isConnected = true;
                console.log('✅ Mock Redis connected');
            },
            async set() { return 'OK'; },
            async get() { return null; },
            async del() { return 0; },
            async exists() { return 0; },
            async info() { 
                return { 
                    version: 'Mock-Redis/1.0.0',
                    mode: 'mock',
                    total_keys: 0,
                    cache_hits: 0,
                    cache_misses: 0,
                    hit_rate: '0%'
                }; 
            }
        };
    }
}

const { cacheMiddleware, clearCache } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 8102;

// Middleware
app.use(cors());
app.use(express.json());

// AI Agent URL
const AI_AGENT_URL = 'http://127.0.0.1:8100/chat';
const BI_API_URL = 'http://127.0.0.1:8101/api/alerts';

// Health check with Redis status
app.get('/health', async (req, res) => {
    try {
        const redisStatus = redis.isConnected ? 'connected' : 'disconnected';
        
        // Test Redis connection
        if (redis.isConnected) {
            await redis.set('health-check', Date.now(), 10);
            const timestamp = await redis.get('health-check');
            const info = await redis.info();
            
            res.json({
                status: 'healthy',
                redis: 'connected',
                timestamp: timestamp,
                redis_info: info,
                services: {
                    api_gateway: `http://localhost:${PORT}`,
                    ai_agent: AI_AGENT_URL,
                    bi_api: BI_API_URL
                },
                cache: 'enabled'
            });
        } else {
            res.json({
                status: 'healthy', 
                redis: 'disconnected',
                services: {
                    api_gateway: `http://localhost:${PORT}`,
                    ai_agent: AI_AGENT_URL,
                    bi_api: BI_API_URL
                },
                cache: 'disabled'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'degraded',
            redis: 'error',
            error: error.message,
            services: {
                api_gateway: `http://localhost:${PORT}`,
                ai_agent: AI_AGENT_URL,
                bi_api: BI_API_URL
            }
        });
    }
});

// Cached endpoints
app.get('/api/cache/stats', cacheMiddleware(60), async (req, res) => {
    try {
        const stats = {
            redis_connected: redis.isConnected,
            cache_enabled: true,
            timestamp: Date.now(),
            memory_usage: process.memoryUsage(),
            redis_info: await redis.info()
        };
        res.json(stats);
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
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔀 Proxying to AI Agent: ${req.url}`);
    }
});

const biProxy = createProxyMiddleware({
    target: BI_API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/bi': '/api/alerts'
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔀 Proxying to BI API: ${req.url}`);
    }
});

// Routes
app.use('/api/ai', aiProxy);
app.use('/api/bi', biProxy);

// Cache management endpoints
app.post('/api/cache/clear', async (req, res) => {
    try {
        const cleared = await clearCache();
        res.json({ 
            message: 'Cache cleared successfully',
            cleared_entries: cleared
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test cache endpoint
app.get('/api/cache/test', cacheMiddleware(30), async (req, res) => {
    const testData = {
        message: 'This is cached data',
        timestamp: Date.now(),
        random: Math.random()
    };
    res.json(testData);
});

// Initialize Redis on startup
async function initializeRedis() {
    try {
        await redis.connect();
        console.log('✅ Redis cache layer initialized');
    } catch (error) {
        console.log('⚠️  Redis not available, running without cache');
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 API Gateway with Redis Cache running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 AI Agent: ${AI_AGENT_URL}`);
    console.log(`📊 BI API: ${BI_API_URL}`);
    console.log(`💾 Cache test: http://localhost:${PORT}/api/cache/test`);
    
    await initializeRedis();
});

module.exports = app;
