const sqlite = require('../../../libs/sqlite/client');

class CacheMetrics {
    static async record(endpoint, wasHit) {
        return await sqlite.recordCacheMetric(endpoint, wasHit);
    }

    static async getStats() {
        return await sqlite.getCacheMetrics();
    }

    static async getOverallStats() {
        const metrics = await sqlite.getCacheMetrics();
        
        const overall = metrics.reduce((acc, metric) => {
            acc.totalHits += metric.cache_hits;
            acc.totalMisses += metric.cache_misses;
            acc.totalRequests += metric.total_requests;
            return acc;
        }, { totalHits: 0, totalMisses: 0, totalRequests: 0 });

        overall.hitRate = overall.totalRequests > 0 
            ? Math.round((overall.totalHits / overall.totalRequests) * 100) 
            : 0;

        return {
            overall,
            endpoints: metrics
        };
    }
}

module.exports = CacheMetrics;
