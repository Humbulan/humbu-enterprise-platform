const kafka = require('../../../libs/kafka/client');

class ApiEvents {
    static async requestReceived(method, endpoint, ip, userAgent) {
        const event = {
            type: 'API_REQUEST',
            method,
            endpoint,
            ip,
            userAgent,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('api-events', event, `api-${endpoint}`);
    }

    static async responseSent(method, endpoint, statusCode, responseTime) {
        const event = {
            type: 'API_RESPONSE',
            method,
            endpoint,
            statusCode,
            responseTime,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('api-events', event, `api-${endpoint}`);
    }

    static async errorOccurred(method, endpoint, error, statusCode = 500) {
        const event = {
            type: 'API_ERROR',
            method,
            endpoint,
            error: error.message,
            statusCode,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('api-events', event, `api-${endpoint}`);
    }
}

module.exports = ApiEvents;
