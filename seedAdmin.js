import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/supply-chain");
        console.log("Connected to MongoDB for seeding...");

        const email = "vishal@maxzom.com";
        const password = "vishal@123";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log(`Admin user with email ${email} already exists.`);
        } else {
            const admin = await User.create({
                name: "Vishal (SuperAdmin)",
                email,
                password,
                role: "SuperAdmin",
                isActive: true
            });
            console.log(`✅ Successfully seeded SuperAdmin account! ID: ${admin._id}`);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding Admin:", error);
        mongoose.connection.close();
    }
};

seedAdmin();
