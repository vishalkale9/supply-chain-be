import express from "express";

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("server running");
});

export default app;
