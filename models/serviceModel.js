// models/serviceModel.js
// [TAUGHT: sem-2/Lect-32-combined-class/app.js & Lect-33-crud/models/gigModel.js]
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, "Vehicle number is required"],
        trim: true,
        uppercase: true
    },
    serviceType: {
        type: String,
        required: [true, "Service type is required"],
        trim: true
    },
    issueDescription: {
        type: String,
        trim: true,
        default: "Regular checkup / No specific issue reported"
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Completed"],
        default: "Pending"
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    serviceDate: {
        type: Date
    },
    partsReplaced: {
        type: String,
        default: "None"
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, "Cost cannot be negative"]
    },
    notes: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Service", serviceSchema);
