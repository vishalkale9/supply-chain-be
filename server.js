import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";

// Connect to database
connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});