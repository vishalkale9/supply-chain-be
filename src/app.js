import express from "express";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for frontend connection
app.use(express.json()); // Parse JSON bodies

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

//health api
app.get("/", (req, res) => {
    res.send("Server is running perfectly! 🚀");
});

export default app;
