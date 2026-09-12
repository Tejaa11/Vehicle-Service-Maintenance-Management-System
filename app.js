// app.js
// [TAUGHT: sem-2/Lect-33-crud/app.js & Lect-34-crud/app.js]
const express = require("express");
const path = require("path");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware Pipeline
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Expose Auth Session Info to all EJS templates [TAUGHT: sem-2/Lect-34 & sem-3/Lect-15]
app.use((req, res, next) => {
    res.locals.currentUser = req.cookies.userName || null;
    res.locals.currentRole = req.cookies.userRole || null;
    res.locals.currentEmail = req.cookies.userEmail || null;
    next();
});

// Simple Request Logger Middleware [TAUGHT: sem-2/Lect-27-middleware/app.js]
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Mount Routes
app.use("/", authRoutes);
app.use("/", vehicleRoutes);
app.use("/", serviceRoutes);

// 404 Catch-All Handler [TAUGHT: sem-2/Lect-27-middleware/app.js]
app.use((req, res) => {
    res.status(404).send("<h2>404 - Page Not Found</h2><p><a href='/'>Return to Dashboard</a></p>");
});

// Listen on dynamic or local port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
