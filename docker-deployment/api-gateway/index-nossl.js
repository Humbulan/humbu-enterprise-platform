const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.HTTP_PORT || 8102;

app.use(express.json());

// Service discovery and routing (localhost for docker-less deployment)
const services = {
    'user-service': 'http://localhost:8201',
    'auth-service': 'http://localhost:8202',
    'payment-service': 'http://localhost:8203',
    'notification-service': 'http://localhost:8204'
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Humbu Microservices API Gateway - No SSL Version',
        timestamp: new Date().toISOString(),
        services: Object.keys(services),
        deployment: 'docker-less-nossl',
        ssl: {
            enabled: false,
            note: 'SSL disabled for immediate testing'
        }
    });
});

// Service routing
app.use('/api/users', createProxyMiddleware({
    target: services['user-service'],
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/users'
    },
    onError: (err, req, res) => {
        res.status(503).json({
            error: 'User service unavailable',
            message: 'Please try again later'
        });
    }
}));

app.use('/api/auth', createProxyMiddleware({
    target: services['auth-service'],
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/auth'
    },
    onError: (err, req, res) => {
        res.status(503).json({
            error: 'Auth service unavailable',
            message: 'Authentication temporarily disabled'
        });
    }
}));

app.use('/api/payments', createProxyMiddleware({
    target: services['payment-service'],
    changeOrigin: true,
    pathRewrite: {
        '^/api/payments': '/payments'
    },
    onError: (err, req, res) => {
        res.status(503).json({
            error: 'Payment service unavailable',
            message: 'Payment processing temporarily disabled'
        });
    }
}));

// Service status endpoint
app.get('/api/services/status', async (req, res) => {
    const status = {};
    
    for (const [serviceName, serviceUrl] of Object.entries(services)) {
        try {
            const response = await fetch(`${serviceUrl}/health`);
            if (response.ok) {
                status[serviceName] = {
                    status: 'healthy',
                    url: serviceUrl,
                    port: serviceUrl.split(':').pop()
                };
            } else {
                status[serviceName] = {
                    status: 'unhealthy', 
                    url: serviceUrl,
                    error: `HTTP ${response.status}`
                };
            }
        } catch (error) {
            status[serviceName] = {
                status: 'unhealthy',
                url: serviceUrl,
                error: error.message
            };
        }
    }
    
    res.json({
        timestamp: new Date().toISOString(),
        deployment: 'docker-less-microservices-nossl',
        services: status
    });
});

// Demo endpoints for testing
app.get('/api/demo/users', (req, res) => {
    res.json({
        users: [
            { id: 1, name: 'Microservice User 1', email: 'user1@humbu.store' },
            { id: 2, name: 'Microservice User 2', email: 'user2@humbu.store' }
        ],
        source: 'api-gateway-nossl',
        timestamp: new Date().toISOString()
    });
});

// Direct service endpoints for testing
app.get('/api/direct/users', (req, res) => {
    // Direct proxy to user service
    fetch('http://localhost:8201/users')
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(503).json({ error: 'User service unavailable' }));
});

app.get('/api/direct/auth/health', (req, res) => {
    fetch('http://localhost:8202/health')
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(503).json({ error: 'Auth service unavailable' }));
});

// Create server
const server = http.createServer(app);

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP Gateway (No SSL) running on port ${PORT}`);
    console.log('');
    console.log('🏰 HUMBU MICROSERVICES PLATFORM - NO SSL VERSION');
    console.log('===============================================');
    console.log('✅ Microservices Architecture');
    console.log('✅ API Gateway Routing');
    console.log('✅ Service Discovery');
    console.log('⚠️  SSL Disabled for Immediate Testing');
    console.log('');
    console.log('🌐 ACCESS POINTS:');
    console.log(`   HTTP:  http://localhost:${PORT}/health`);
    console.log('');
    console.log('🔧 MICROSERVICES:');
    Object.entries(services).forEach(([name, url]) => {
        console.log(`   📍 ${name}: ${url}`);
    });
    console.log('');
    console.log('🚀 MICROSERVICES READY FOR TESTING!');
    console.log('');
    console.log('🔧 TEST ENDPOINTS:');
    console.log(`   Health:        curl http://localhost:${PORT}/health`);
    console.log(`   Users:         curl http://localhost:${PORT}/api/users`);
    console.log(`   Services:      curl http://localhost:${PORT}/api/services/status`);
    console.log(`   Direct Users:  curl http://localhost:${PORT}/api/direct/users`);
});

// Notification Service routing
app.use('/api/notifications', createProxyMiddleware({
    target: 'http://localhost:8204',
    changeOrigin: true,
    pathRewrite: {
        '^/api/notifications': '/notifications'
    },
    onError: (err, req, res) => {
        res.status(503).json({
            error: 'Notification service unavailable',
            message: 'Please try again later'
        });
    }
}));
