import amqp from 'amqplib'

let channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        // Ensure our queue exists before we try to use it

        await channel.assertQueue('notification_queue');

        console.log('✅ connect to RabbitMQ');

    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ', error);

    }
}


export const publishMessage = async (queue, message) => {
    if (!channel) {
        console.warn('⚠️ RabbitMQ Channel not initialized, skipping publish message.');
        return;
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}


export const consumeMessage = async (queue, callback) => {
    if (!channel) {
        console.warn("⚠️ RabbitMQ Channel not initialized, skipping consume message.");
        return;
    }

    channel.consume(queue, (message) => {
        if (message !== null) {
            const parsedMessage = JSON.parse(message.content.toString());
            callback(parsedMessage);
            channel.ack(message);//Acknowledge so RabbitMQ removes it
        }
    })
}