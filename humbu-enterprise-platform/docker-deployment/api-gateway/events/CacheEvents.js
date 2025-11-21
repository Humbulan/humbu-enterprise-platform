const kafka = require('../../../libs/kafka/client');

class CacheEvents {
    static async cacheHit(endpoint, key, responseTime) {
        const event = {
            type: 'CACHE_HIT',
            endpoint,
            cacheKey: key,
            responseTime,
            timestamp: new Date().toISOString(),
            source: 'redis-cache'
        };

        await kafka.produce('cache-events', event, `cache-${endpoint}`);
    }

    static async cacheMiss(endpoint, key, responseTime) {
        const event = {
            type: 'CACHE_MISS',
            endpoint,
            cacheKey: key,
            responseTime,
            timestamp: new Date().toISOString(),
            source: 'redis-cache'
        };

        await kafka.produce('cache-events', event, `cache-${endpoint}`);
    }

    static async cacheSet(endpoint, key, ttl) {
        const event = {
            type: 'CACHE_SET',
            endpoint,
            cacheKey: key,
            ttl,
            timestamp: new Date().toISOString(),
            source: 'redis-cache'
        };

        await kafka.produce('cache-events', event, `cache-${endpoint}`);
    }

    static async cacheClear(pattern, clearedCount) {
        const event = {
            type: 'CACHE_CLEARED',
            pattern,
            clearedCount,
            timestamp: new Date().toISOString(),
            source: 'redis-cache'
        };

        await kafka.produce('cache-events', event, 'cache-clear');
    }
}

module.exports = CacheEvents;
