const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

class LoadBalancer {
    constructor() {
        this.services = {
            'user-service': [
                { url: 'http://localhost:8201', healthy: true, weight: 1 },
                { url: 'http://localhost:8202', healthy: true, weight: 1 }
            ],
            'auth-service': [
                { url: 'http://localhost:8301', healthy: true, weight: 1 },
                { url: 'http://localhost:8302', healthy: true, weight: 1 }
            ],
            'api-service': [
                { url: 'http://localhost:8102', healthy: true, weight: 1 }
            ]
        };
        this.currentIndexes = {};
    }

    getNextServer(serviceName) {
        const servers = this.services[serviceName];
        if (!servers || servers.length === 0) {
            throw new Error(`No servers available for ${serviceName}`);
        }

        // Simple round-robin load balancing
        if (!this.currentIndexes[serviceName]) {
            this.currentIndexes[serviceName] = 0;
        }

        const healthyServers = servers.filter(server => server.healthy);
        if (healthyServers.length === 0) {
            throw new Error(`No healthy servers available for ${serviceName}`);
        }

        const server = healthyServers[this.currentIndexes[serviceName] % healthyServers.length];
        this.currentIndexes[serviceName] = (this.currentIndexes[serviceName] + 1) % healthyServers.length;

        return server;
    }

    markServerUnhealthy(serviceName, url) {
        const server = this.services[serviceName]?.find(s => s.url === url);
        if (server) {
            server.healthy = false;
            console.log(`🚨 Marked server as unhealthy: ${serviceName} - ${url}`);
        }
    }

    markServerHealthy(serviceName, url) {
        const server = this.services[serviceName]?.find(s => s.url === url);
        if (server) {
            server.healthy = true;
            console.log(`✅ Marked server as healthy: ${serviceName} - ${url}`);
        }
    }

    getServiceStats() {
        const stats = {};
        for (const [serviceName, servers] of Object.entries(this.services)) {
            stats[serviceName] = {
                total: servers.length,
                healthy: servers.filter(s => s.healthy).length,
                servers: servers.map(s => ({
                    url: s.url,
                    healthy: s.healthy,
                    weight: s.weight
                }))
            };
        }
        return stats;
    }
}

const loadBalancer = new LoadBalancer();
const app = express();
const PORT = process.env.LB_PORT || 8000;

// Health check endpoint for load balancer itself
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'load-balancer',
        stats: loadBalancer.getServiceStats()
    });
});

// Service routing with load balancing
app.use('/api/users', (req, res, next) => {
    try {
        const server = loadBalancer.getNextServer('user-service');
        const proxy = createProxyMiddleware({
            target: server.url,
            changeOrigin: true,
            onError: (err, req, res) => {
                loadBalancer.markServerUnhealthy('user-service', server.url);
                res.status(503).json({ error: 'Service temporarily unavailable' });
            }
        });
        proxy(req, res, next);
    } catch (error) {
        res.status(503).json({ error: 'Service unavailable' });
    }
});

app.use('/api/auth', (req, res, next) => {
    try {
        const server = loadBalancer.getNextServer('auth-service');
        const proxy = createProxyMiddleware({
            target: server.url,
            changeOrigin: true,
            onError: (err, req, res) => {
                loadBalancer.markServerUnhealthy('auth-service', server.url);
                res.status(503).json({ error: 'Service temporarily unavailable' });
            }
        });
        proxy(req, res, next);
    } catch (error) {
        res.status(503).json({ error: 'Service unavailable' });
    }
});

// Default route to main API service
app.use('/', (req, res, next) => {
    try {
        const server = loadBalancer.getNextServer('api-service');
        const proxy = createProxyMiddleware({
            target: server.url,
            changeOrigin: true,
            onError: (err, req, res) => {
                loadBalancer.markServerUnhealthy('api-service', server.url);
                res.status(503).json({ error: 'Service temporarily unavailable' });
            }
        });
        proxy(req, res, next);
    } catch (error) {
        res.status(503).json({ error: 'Service unavailable' });
    }
});

// Load balancer management endpoints
app.get('/lb/stats', (req, res) => {
    res.json(loadBalancer.getServiceStats());
});

app.post('/lb/health/:serviceName/:url', (req, res) => {
    const { serviceName, url } = req.params;
    const { healthy } = req.body;

    if (healthy === false) {
        loadBalancer.markServerUnhealthy(serviceName, decodeURIComponent(url));
    } else {
        loadBalancer.markServerHealthy(serviceName, decodeURIComponent(url));
    }

    res.json({ message: 'Server health updated', stats: loadBalancer.getServiceStats() });
});

app.listen(PORT, () => {
    console.log(`⚖️ Load Balancer running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`📊 Stats: http://localhost:${PORT}/lb/stats`);
    console.log('🔀 Routing:');
    console.log('   /api/users → user-service (round-robin)');
    console.log('   /api/auth → auth-service (round-robin)');
    console.log('   / → api-service (round-robin)');
});

module.exports = app;
