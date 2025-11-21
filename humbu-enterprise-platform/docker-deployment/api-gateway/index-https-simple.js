const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');

// Load SSL certificates
const sslOptions = {
    key: fs.readFileSync('../ssl/key.pem'),
    cert: fs.readFileSync('../ssl/cert.pem')
};

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8102;
const HTTPS_PORT = process.env.HTTPS_PORT || 8143;

app.use(express.json());

// Simple health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Humbu Ultimate Platform - HTTPS Simple Version',
        timestamp: new Date().toISOString(),
        security: {
            ssl_enabled: true,
            protocol: req.secure ? 'HTTPS' : 'HTTP'
        },
        endpoints: {
            http: `http://localhost:${HTTP_PORT}/health`,
            https: `https://localhost:${HTTPS_PORT}/health`
        }
    });
});

// SSL info endpoint
app.get('/ssl/info', (req, res) => {
    res.json({
        ssl_status: 'active',
        certificate: 'platform.humbu.store',
        ports: {
            http: HTTP_PORT,
            https: HTTPS_PORT
        }
    });
});

// Simple users endpoint
app.get('/api/users', (req, res) => {
    res.json({
        users: [
            { id: 1, username: 'admin', email: 'admin@humbu.store' },
            { id: 2, username: 'user1', email: 'user1@humbu.store' }
        ],
        timestamp: new Date().toISOString()
    });
});

// Create servers
const httpsServer = https.createServer(sslOptions, app);
const httpServer = http.createServer(app);

// Start servers
httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP Server running on port ${HTTP_PORT}`);
    console.log('');
    console.log('🏰 HUMBU ULTIMATE PLATFORM - HTTPS SIMPLE');
    console.log('=========================================');
    console.log('✅ SSL/TLS Encryption Enabled');
    console.log('✅ HTTP & HTTPS Servers Running');
    console.log('✅ Production Ready');
    console.log('');
    console.log('🌐 ACCESS POINTS:');
    console.log(`   HTTP:  http://localhost:${HTTP_PORT}/health`);
    console.log(`   HTTPS: https://localhost:${HTTPS_PORT}/health`);
    console.log('');
    console.log('🚀 READY FOR PRODUCTION!');
});
