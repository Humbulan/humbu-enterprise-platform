// Try to load Redis with multiple path options
let redis;
try {
    redis = require('../../../libs/redis/client');
    console.log('✅ Redis client loaded in middleware');
} catch (error) {
    console.log('⚠️  Redis not available in middleware, using mock');
    redis = {
        isConnected: false,
        async set() { return 'OK'; },
        async get() { return null; },
        async del() { return 0; },
        async keys() { return []; }
    };
}

const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cached = await redis.get(key);
            
            if (cached) {
                console.log(`✅ Cache HIT: ${req.originalUrl}`);
                const data = JSON.parse(cached);
                return res.json(data);
            }

            const originalJson = res.json;
            res.json = function(data) {
                redis.set(key, JSON.stringify(data), duration)
                    .then(() => console.log(`✅ Cache SET: ${req.originalUrl} (TTL: ${duration}s)`))
                    .catch(err => console.error('❌ Cache set error:', err));
                
                originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('❌ Cache middleware error:', error);
            next();
        }
    };
};

const clearCache = async (pattern = 'cache:*') => {
    try {
        if (redis.isConnected) {
            const keys = await redis.keys(pattern);
            let deleted = 0;
            
            for (const key of keys) {
                await redis.del(key);
                deleted++;
            }
            
            console.log(`🧹 Cleared ${deleted} cache entries`);
            return deleted;
        }
        return 0;
    } catch (error) {
        console.error('❌ Clear cache error:', error);
        return 0;
    }
};

module.exports = { cacheMiddleware, clearCache };
