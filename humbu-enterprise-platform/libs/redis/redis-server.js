// JavaScript Redis Server Implementation
// Compatible with Redis commands for caching

class JavaScriptRedis {
    constructor() {
        this.data = new Map();
        this.expirations = new Map();
        this.connected = false;
        this.stats = {
            commands_processed: 0,
            keys_stored: 0,
            cache_hits: 0,
            cache_misses: 0
        };
    }

    async connect() {
        console.log('🔄 Starting JavaScript Redis server...');
        this.connected = true;
        
        // Clear any expired keys on startup
        this._clearExpiredKeys();
        
        console.log('✅ JavaScript Redis server ready (in-memory mode)');
        return this;
    }

    async disconnect() {
        this.connected = false;
        console.log('🛑 JavaScript Redis server stopped');
        return true;
    }

    async set(key, value, ttl = null) {
        if (!this.connected) await this.connect();
        
        this.data.set(key, value);
        this.stats.commands_processed++;
        this.stats.keys_stored = this.data.size;

        if (ttl && ttl > 0) {
            const expiration = Date.now() + (ttl * 1000);
            this.expirations.set(key, expiration);
            
            // Auto-cleanup after TTL
            setTimeout(() => {
                if (this.data.get(key) === value) {
                    this.data.delete(key);
                    this.expirations.delete(key);
                    this.stats.keys_stored = this.data.size;
                }
            }, ttl * 1000);
        } else {
            this.expirations.delete(key);
        }

        return 'OK';
    }

    async get(key) {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;

        // Check if key has expired
        if (this._isExpired(key)) {
            this.data.delete(key);
            this.expirations.delete(key);
            this.stats.cache_misses++;
            this.stats.keys_stored = this.data.size;
            return null;
        }

        const value = this.data.get(key);
        if (value) {
            this.stats.cache_hits++;
        } else {
            this.stats.cache_misses++;
        }
        
        return value || null;
    }

    async del(key) {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;

        const existed = this.data.has(key);
        this.data.delete(key);
        this.expirations.delete(key);
        this.stats.keys_stored = this.data.size;
        
        return existed ? 1 : 0;
    }

    async exists(key) {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;

        if (this._isExpired(key)) {
            this.data.delete(key);
            this.expirations.delete(key);
            this.stats.keys_stored = this.data.size;
            return 0;
        }
        
        return this.data.has(key) ? 1 : 0;
    }

    async keys(pattern = '*') {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;

        const allKeys = Array.from(this.data.keys());
        
        // Filter out expired keys
        const validKeys = allKeys.filter(key => !this._isExpired(key));
        
        if (pattern === '*') {
            return validKeys;
        }
        
        // Simple pattern matching
        if (pattern.endsWith('*')) {
            const prefix = pattern.slice(0, -1);
            return validKeys.filter(key => key.startsWith(prefix));
        }
        
        return validKeys.filter(key => key === pattern);
    }

    async flushall() {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;

        const count = this.data.size;
        this.data.clear();
        this.expirations.clear();
        this.stats.keys_stored = 0;
        this.stats.cache_hits = 0;
        this.stats.cache_misses = 0;
        
        return count;
    }

    async info() {
        if (!this.connected) await this.connect();
        
        return {
            version: 'JavaScript-Redis/1.0.0',
            mode: 'in-memory',
            os: 'Node.js',
            connected_clients: 1,
            total_keys: this.data.size,
            commands_processed: this.stats.commands_processed,
            cache_hits: this.stats.cache_hits,
            cache_misses: this.stats.cache_misses,
            hit_rate: this.stats.cache_hits + this.stats.cache_misses > 0 
                ? (this.stats.cache_hits / (this.stats.cache_hits + this.stats.cache_misses) * 100).toFixed(2) + '%'
                : '0%',
            memory_usage: process.memoryUsage().heapUsed,
            uptime: process.uptime().toFixed(2) + 's'
        };
    }

    async ping(message = 'PONG') {
        if (!this.connected) await this.connect();
        this.stats.commands_processed++;
        return message;
    }

    // Private methods
    _isExpired(key) {
        const expiration = this.expirations.get(key);
        return expiration && Date.now() > expiration;
    }

    _clearExpiredKeys() {
        const now = Date.now();
        for (const [key, expiration] of this.expirations.entries()) {
            if (now > expiration) {
                this.data.delete(key);
                this.expirations.delete(key);
            }
        }
        this.stats.keys_stored = this.data.size;
    }
}

module.exports = JavaScriptRedis;
