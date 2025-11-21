const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8102;
const HTTPS_PORT = process.env.HTTPS_PORT || 8143;

// SSL configuration
const sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};

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
        message: 'Humbu Microservices API Gateway - Docker-less',
        timestamp: new Date().toISOString(),
        services: Object.keys(services),
        deployment: 'docker-less',
        ssl: {
            enabled: true,
            https_port: HTTPS_PORT
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
        deployment: 'docker-less-microservices',
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
        source: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

// Create servers
const httpsServer = https.createServer(sslOptions, app);
const httpServer = http.createServer(app);

// Start servers
httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`🔒 HTTPS Gateway running on port ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP Gateway running on port ${HTTP_PORT}`);
    console.log('');
    console.log('🏰 HUMBU MICROSERVICES PLATFORM - DOCKER-LESS');
    console.log('============================================');
    console.log('✅ SSL/TLS Encryption Enabled');
    console.log('✅ Microservices Architecture');
    console.log('✅ API Gateway Routing');
    console.log('✅ Service Discovery (Docker-less)');
    console.log('');
    console.log('🌐 ACCESS POINTS:');
    console.log(`   HTTP:  http://localhost:${HTTP_PORT}/health`);
    console.log(`   HTTPS: https://localhost:${HTTPS_PORT}/health`);
    console.log('');
    console.log('🔧 MICROSERVICES:');
    Object.entries(services).forEach(([name, url]) => {
        console.log(`   📍 ${name}: ${url}`);
    });
    console.log('');
    console.log('🚀 DOCKER-LESS MICROSERVICES READY!');
});
