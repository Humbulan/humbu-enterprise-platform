const JavaScriptRedis = require('./redis-server');

class RedisClient {
    constructor() {
        this.redis = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.redis = new JavaScriptRedis();
            await this.redis.connect();
            this.isConnected = true;
            console.log('✅ JavaScript Redis client connected');
            return this.redis;
        } catch (error) {
            console.error('❌ Redis connection failed:', error);
            throw error;
        }
    }

    async set(key, value, ttl = null) {
        if (!this.isConnected) await this.connect();
        return this.redis.set(key, value, ttl);
    }

    async get(key) {
        if (!this.isConnected) await this.connect();
        return this.redis.get(key);
    }

    async del(key) {
        if (!this.isConnected) await this.connect();
        return this.redis.del(key);
    }

    async exists(key) {
        if (!this.isConnected) await this.connect();
        return this.redis.exists(key);
    }

    async keys(pattern = '*') {
        if (!this.isConnected) await this.connect();
        return this.redis.keys(pattern);
    }

    async flushall() {
        if (!this.isConnected) await this.connect();
        return this.redis.flushall();
    }

    async info() {
        if (!this.isConnected) await this.connect();
        return this.redis.info();
    }

    async ping() {
        if (!this.isConnected) await this.connect();
        return this.redis.ping();
    }

    async disconnect() {
        if (this.redis && this.isConnected) {
            await this.redis.disconnect();
            this.isConnected = false;
        }
    }
}

// Create singleton instance
const redisClient = new RedisClient();

// Auto-connect on first use
redisClient.connect().catch(console.error);

module.exports = redisClient;
