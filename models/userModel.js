// models/userModel.js
// [TAUGHT: sem-2/Lect-32-combined-class/app.js & sem-3/Lect-16-nodejs-authentication-system]
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["owner", "admin"],
        default: "owner"
    },
    phone: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
