const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8102;

// Simple Kafka mock
const kafka = {
    isConnected: true,
    topics: new Set(['user-events', 'cache-events', 'api-events']),
    async produce(topic, message) {
        console.log(`📨 [KAFKA] Produced to ${topic}:`, typeof message === 'object' ? JSON.stringify(message).substring(0, 100) + '...' : message);
        return { success: true, topic, timestamp: Date.now() };
    },
    async getTopics() {
        return Array.from(this.topics);
    },
    async getStats() {
        return {
            connected: true,
            topics: this.topics.size,
            brokers: 1,
            version: 'mock-1.0.0'
        };
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', async (req, res) => {
    res.json({
        status: 'healthy',
        services: {
            api_gateway: `http://localhost:${PORT}`,
            kafka: 'connected',
            redis: 'mock',
            sqlite: 'mock'
        },
        kafka: await kafka.getStats(),
        features: {
            caching: 'mock',
            persistence: 'mock',
            event_streaming: 'enabled'
        }
    });
});

// Kafka endpoints
app.get('/api/kafka/topics', async (req, res) => {
    res.json({ topics: await kafka.getTopics() });
});

app.post('/api/kafka/events', async (req, res) => {
    const { topic, message } = req.body;
    const result = await kafka.produce(topic || 'test-events', message || { type: 'TEST' });
    res.json({ message: 'Event sent successfully', result });
});

// User creation with Kafka events
app.post('/api/users', async (req, res) => {
    const { username, email } = req.body;
    
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email required' });
    }

    const user = { id: Date.now(), username, email };
    
    // Send Kafka event
    await kafka.produce('user-events', {
        type: 'USER_CREATED',
        user,
        timestamp: new Date().toISOString()
    });

    res.json({ 
        message: 'User created with Kafka event',
        user,
        event_sent: true
    });
});

// Cache test with events
app.get('/api/cache/test', async (req, res) => {
    await kafka.produce('cache-events', {
        type: 'CACHE_ACCESS',
        endpoint: '/api/cache/test',
        timestamp: Date.now()
    });

    res.json({
        message: 'Cache test with Kafka events',
        timestamp: Date.now(),
        kafka_event: 'sent'
    });
});

// AI Proxy (existing functionality)
const aiProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:8100',
    changeOrigin: true,
    pathRewrite: { '^/api/ai': '/chat' }
});

const biProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:8101', 
    changeOrigin: true,
    pathRewrite: { '^/api/bi': '/api/alerts' }
});

app.use('/api/ai', aiProxy);
app.use('/api/bi', biProxy);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SIMPLE KAFKA API GATEWAY running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`📨 Kafka: http://localhost:${PORT}/api/kafka/*`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
    console.log(`💾 Cache: http://localhost:${PORT}/api/cache/test`);
    console.log(`🤖 AI: http://localhost:${PORT}/api/ai`);
    console.log(`📊 BI: http://localhost:${PORT}/api/bi`);
});

module.exports = app;
