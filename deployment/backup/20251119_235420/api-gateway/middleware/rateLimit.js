const redis = require('../../../libs/redis/client');

class RateLimiter {
    constructor() {
        this.limits = {
            'api-global': { windowMs: 60000, max: 1000 }, // 1000 requests per minute globally
            'api-auth': { windowMs: 60000, max: 100 },    // 100 auth requests per minute
            'api-users': { windowMs: 60000, max: 500 },   // 500 user requests per minute
            'api-admin': { windowMs: 60000, max: 200 }    // 200 admin requests per minute
        };
    }

    async checkLimit(identifier, limitType = 'api-global') {
        const limit = this.limits[limitType];
        if (!limit) return { allowed: true, remaining: 999 };

        const key = `rate_limit:${limitType}:${identifier}`;
        const now = Date.now();
        const windowStart = now - limit.windowMs;

        try {
            // Get current count
            const current = await redis.get(key);
            const requests = current ? JSON.parse(current) : { count: 0, resetTime: now + limit.windowMs };

            // Reset if window passed
            if (now > requests.resetTime) {
                requests.count = 1;
                requests.resetTime = now + limit.windowMs;
            } else {
                requests.count++;
            }

            // Save updated count
            await redis.set(key, JSON.stringify(requests), Math.ceil(limit.windowMs / 1000));

            const remaining = Math.max(0, limit.max - requests.count);
            const allowed = requests.count <= limit.max;

            return {
                allowed,
                remaining,
                resetTime: requests.resetTime,
                limit: limit.max,
                windowMs: limit.windowMs
            };
        } catch (error) {
            // If Redis fails, allow the request
            console.error('Rate limit error:', error);
            return { allowed: true, remaining: 999, error: 'Rate limit service unavailable' };
        }
    }

    middleware(limitType = 'api-global') {
        return async (req, res, next) => {
            const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            
            const limitResult = await this.checkLimit(identifier, limitType);
            
            if (!limitResult.allowed) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: `Too many requests. Try again in ${Math.ceil((limitResult.resetTime - Date.now()) / 1000)} seconds.`,
                    limit: limitResult.limit,
                    remaining: 0,
                    reset: limitResult.resetTime
                });
            }

            // Add rate limit headers
            res.set({
                'X-RateLimit-Limit': limitResult.limit,
                'X-RateLimit-Remaining': limitResult.remaining,
                'X-RateLimit-Reset': limitResult.resetTime
            });

            next();
        };
    }
}

module.exports = new RateLimiter();
