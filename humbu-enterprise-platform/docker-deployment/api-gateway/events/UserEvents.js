const kafka = require('../../../libs/kafka/client');

class UserEvents {
    static async userCreated(userData) {
        const event = {
            type: 'USER_CREATED',
            userId: userData.id,
            username: userData.username,
            email: userData.email,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('user-events', event, `user-${userData.id}`);
        console.log(`📨 User created event sent: ${userData.username}`);
    }

    static async userLoggedIn(userId, sessionToken) {
        const event = {
            type: 'USER_LOGGED_IN',
            userId,
            sessionToken,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('user-events', event, `user-${userId}`);
        console.log(`📨 User login event sent: ${userId}`);
    }

    static async userAction(userId, action, metadata = {}) {
        const event = {
            type: 'USER_ACTION',
            userId,
            action,
            metadata,
            timestamp: new Date().toISOString(),
            source: 'api-gateway'
        };

        await kafka.produce('user-events', event, `user-${userId}`);
        console.log(`📨 User action event sent: ${userId} - ${action}`);
    }
}

module.exports = UserEvents;
