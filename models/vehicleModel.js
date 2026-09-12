// models/vehicleModel.js
// [TAUGHT: sem-2/Lect-32-combined-class/app.js & Lect-33-crud/models/gigModel.js]
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, "Vehicle number is required"],
        unique: true,
        trim: true,
        uppercase: true
    },
    model: {
        type: String,
        required: [true, "Vehicle model is required"],
        trim: true
    },
    purchaseDate: {
        type: Date,
        required: [true, "Purchase date is required"]
    },
    currentMileage: {
        type: Number,
        required: [true, "Current mileage is required"],
        min: [0, "Mileage cannot be negative"]
    },
    ownerName: {
        type: String,
        required: [true, "Owner name is required"],
        trim: true
    },
    ownerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    ownerPhone: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
