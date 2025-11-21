const kafka = require('../../../libs/kafka/client');
const sqlite = require('../../../libs/sqlite/client');

class MetricsConsumer {
    static async start() {
        console.log('🚀 Starting Metrics Consumer...');
        
        await kafka.consume('metrics-group', 'user-events', async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                await this.processUserEvent(event);
            } catch (error) {
                console.error('❌ Error processing user event:', error);
            }
        }, { processExisting: true });

        await kafka.consume('metrics-group', 'cache-events', async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                await this.processCacheEvent(event);
            } catch (error) {
                console.error('❌ Error processing cache event:', error);
            }
        }, { processExisting: true });

        await kafka.consume('metrics-group', 'api-events', async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                await this.processApiEvent(event);
            } catch (error) {
                console.error('❌ Error processing API event:', error);
            }
        }, { processExisting: true });

        console.log('✅ Metrics Consumer started and listening for events');
    }

    static async processUserEvent(event) {
        console.log('📊 Processing user event:', event.type, event.userId);
        
        // Store user metrics in SQLite
        if (event.type === 'USER_CREATED') {
            await sqlite.recordUserMetric(event.userId, 'user_created', event);
        } else if (event.type === 'USER_LOGGED_IN') {
            await sqlite.recordUserMetric(event.userId, 'user_login', event);
        }
    }

    static async processCacheEvent(event) {
        console.log('📊 Processing cache event:', event.type, event.endpoint);
        
        // Update cache metrics in SQLite
        if (event.type === 'CACHE_HIT' || event.type === 'CACHE_MISS') {
            await sqlite.recordCacheMetric(event.endpoint, event.type === 'CACHE_HIT');
        }
    }

    static async processApiEvent(event) {
        console.log('📊 Processing API event:', event.type, event.endpoint);
        
        // Store API metrics
        if (event.type === 'API_REQUEST') {
            await sqlite.recordApiMetric(event.endpoint, event.method, event.statusCode, event.responseTime);
        }
    }
}

module.exports = MetricsConsumer;
