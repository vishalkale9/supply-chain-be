import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import { connectRabbitMQ } from './src/utils/rabbitmq.js';
import { startNotificationWorker } from './src/workers/notification.worker.js';
// Connect to database
connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`server running on port ${PORT}`);
    // Initialize RabbitMQ services
    await connectRabbitMQ();
    await startNotificationWorker();
});