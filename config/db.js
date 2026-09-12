// config/db.js
// [TAUGHT: sem-2/Lect-33-crud/config/db.js & sem-2/Lect-31-db/server.js]
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "vehicleServiceDB"
        });
        console.log(`MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
