const kafka = require('../../../libs/kafka/client');

class NotificationConsumer {
    static async start() {
        console.log('🚀 Starting Notification Consumer...');
        
        await kafka.consume('notification-group', 'user-events', async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                await this.processUserNotification(event);
            } catch (error) {
                console.error('❌ Error processing notification event:', error);
            }
        }, { processExisting: true });

        await kafka.consume('notification-group', 'system-metrics', async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                await this.processSystemNotification(event);
            } catch (error) {
                console.error('❌ Error processing system event:', error);
            }
        }, { processExisting: true });

        console.log('✅ Notification Consumer started');
    }

    static async processUserNotification(event) {
        if (event.type === 'USER_CREATED') {
            console.log(`📧 Welcome email would be sent to: ${event.email}`);
            // In production: send welcome email, Slack notification, etc.
        } else if (event.type === 'USER_LOGGED_IN') {
            console.log(`🔐 Security alert: User ${event.userId} logged in`);
            // In production: send security notification
        }
    }

    static async processSystemNotification(event) {
        if (event.type === 'HIGH_ERROR_RATE') {
            console.log(`🚨 Alert: High error rate detected - ${event.message}`);
            // In production: send to monitoring system
        } else if (event.type === 'PERFORMANCE_ISSUE') {
            console.log(`⚠️ Performance alert: ${event.message}`);
            // In production: send to ops team
        }
    }
}

module.exports = NotificationConsumer;
