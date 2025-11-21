const express = require('express');
const dns = require('dns');

class DNSServiceRegistry {
    constructor() {
        this.services = new Map();
        this.healthChecks = new Map();
    }

    registerService(serviceName, instance) {
        if (!this.services.has(serviceName)) {
            this.services.set(serviceName, []);
        }

        const instances = this.services.get(serviceName);
        const existingInstance = instances.find(inst => inst.id === instance.id);
        
        if (existingInstance) {
            // Update existing instance
            Object.assign(existingInstance, instance);
        } else {
            // Add new instance
            instances.push({
                ...instance,
                registeredAt: new Date().toISOString(),
                lastHealthCheck: new Date().toISOString()
            });
        }

        console.log(`✅ Registered service: ${serviceName} - ${instance.url}`);
        return instance;
    }

    deregisterService(serviceName, instanceId) {
        const instances = this.services.get(serviceName);
        if (instances) {
            const index = instances.findIndex(inst => inst.id === instanceId);
            if (index !== -1) {
                instances.splice(index, 1);
                console.log(`🗑️ Deregistered service: ${serviceName} - ${instanceId}`);
                return true;
            }
        }
        return false;
    }

    discoverService(serviceName, strategy = 'round-robin') {
        const instances = this.services.get(serviceName) || [];
        const healthyInstances = instances.filter(inst => inst.healthy !== false);

        if (healthyInstances.length === 0) {
            throw new Error(`No healthy instances available for ${serviceName}`);
        }

        switch (strategy) {
            case 'round-robin':
                return this._roundRobin(serviceName, healthyInstances);
            case 'random':
                return this._random(healthyInstances);
            case 'least-connections':
                return this._leastConnections(healthyInstances);
            default:
                return healthyInstances[0];
        }
    }

    _roundRobin(serviceName, instances) {
        if (!this._counters) this._counters = new Map();
        const counter = this._counters.get(serviceName) || 0;
        const instance = instances[counter % instances.length];
        this._counters.set(serviceName, counter + 1);
        return instance;
    }

    _random(instances) {
        return instances[Math.floor(Math.random() * instances.length)];
    }

    _leastConnections(instances) {
        return instances.reduce((min, instance) => 
            (instance.connections || 0) < (min.connections || 0) ? instance : min
        );
    }

    updateHealth(serviceName, instanceId, healthy) {
        const instances = this.services.get(serviceName);
        if (instances) {
            const instance = instances.find(inst => inst.id === instanceId);
            if (instance) {
                instance.healthy = healthy;
                instance.lastHealthCheck = new Date().toISOString();
                console.log(`🏥 Health update: ${serviceName} - ${instanceId} - ${healthy ? 'healthy' : 'unhealthy'}`);
            }
        }
    }

    getAllServices() {
        const result = {};
        for (const [serviceName, instances] of this.services) {
            result[serviceName] = {
                totalInstances: instances.length,
                healthyInstances: instances.filter(inst => inst.healthy !== false).length,
                instances: instances.map(inst => ({
                    id: inst.id,
                    url: inst.url,
                    healthy: inst.healthy,
                    registeredAt: inst.registeredAt,
                    lastHealthCheck: inst.lastHealthCheck
                }))
            };
        }
        return result;
    }
}

const dnsRegistry = new DNSServiceRegistry();
const app = express();
const PORT = process.env.DNS_PORT || 5353;

app.use(express.json());

// Service registration endpoint
app.post('/register', (req, res) => {
    const { serviceName, instance } = req.body;
    
    if (!serviceName || !instance || !instance.id || !instance.url) {
        return res.status(400).json({ error: 'Service name and instance details required' });
    }

    const registeredInstance = dnsRegistry.registerService(serviceName, instance);
    res.json({ 
        message: 'Service registered successfully',
        instance: registeredInstance 
    });
});

// Service discovery endpoint
app.get('/discover/:serviceName', (req, res) => {
    const { serviceName } = req.params;
    const { strategy } = req.query;

    try {
        const instance = dnsRegistry.discoverService(serviceName, strategy);
        res.json({ instance });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Health check reporting
app.post('/health/:serviceName/:instanceId', (req, res) => {
    const { serviceName, instanceId } = req.params;
    const { healthy } = req.body;

    dnsRegistry.updateHealth(serviceName, instanceId, healthy);
    res.json({ message: 'Health status updated' });
});

// Service deregistration
app.delete('/deregister/:serviceName/:instanceId', (req, res) => {
    const { serviceName, instanceId } = req.params;
    
    const success = dnsRegistry.deregisterService(serviceName, instanceId);
    if (success) {
        res.json({ message: 'Service deregistered successfully' });
    } else {
        res.status(404).json({ error: 'Service instance not found' });
    }
});

// Get all registered services
app.get('/services', (req, res) => {
    const services = dnsRegistry.getAllServices();
    res.json({ services });
});

// DNS resolution simulation
app.get('/resolve/:hostname', (req, res) => {
    const { hostname } = req.params;
    
    // Mock DNS resolution based on service names
    const serviceMap = {
        'api.humbu.store': 'api-service',
        'users.humbu.store': 'user-service', 
        'auth.humbu.store': 'auth-service',
        'lb.humbu.store': 'load-balancer'
    };

    const serviceName = serviceMap[hostname];
    if (serviceName) {
        try {
            const instance = dnsRegistry.discoverService(serviceName);
            res.json({
                hostname,
                ip: instance.url,
                ttl: 300,
                service: serviceName
            });
        } catch (error) {
            res.status(404).json({ error: `No instances available for ${serviceName}` });
        }
    } else {
        // Fallback to system DNS
        dns.lookup(hostname, (err, address) => {
            if (err) {
                res.status(404).json({ error: 'Hostname not found' });
            } else {
                res.json({ hostname, ip: address, ttl: 300 });
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 DNS Server running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   POST /register - Register service`);
    console.log(`   GET /discover/:service - Discover service`);
    console.log(`   GET /services - List all services`);
    console.log(`   GET /resolve/:hostname - DNS resolution`);
});

module.exports = app;
