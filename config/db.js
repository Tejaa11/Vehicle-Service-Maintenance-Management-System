// config/db.js
// [TAUGHT: sem-2/Lect-33-crud/config/db.js & sem-2/Lect-31-db/server.js]
const mongoose = require("mongoose");
const authController = require("../controllers/authController");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MongoDB Connection Error: MONGO_URI environment variable is missing.");
            console.error("Please add MONGO_URI in your environment settings (e.g. Render Dashboard -> Environment).");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "vehicleServiceDB",
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

        // Seed default admin account only after connection is established
        if (authController && authController.seedDefaultUsers) {
            await authController.seedDefaultUsers();
        }
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        console.error("If deploying on cloud (e.g., Render), make sure to whitelist IP 0.0.0.0/0 in MongoDB Atlas -> Network Access.");
    }
};

module.exports = connectDB;

