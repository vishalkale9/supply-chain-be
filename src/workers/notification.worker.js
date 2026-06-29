import { consumeMessage } from '../utils/rabbitmq.js';
import Notification from '../models/notification.model.js';

export const startNotificationWorker = async () => {
    console.log('🎧 Notification Worker listening for events...');

    await consumeMessage('notification_queue', async (data) => {
        try {
            console.log('📬 Event received from RabbitMQ:', data);

            await Notification.create({
                userId: data.userId,
                message: data.message,
                type: data.type || 'ORDER_UPDATE'
            });

        } catch (error) {
            console.error('❌ Error processing notification', error);
        }
    });
};
