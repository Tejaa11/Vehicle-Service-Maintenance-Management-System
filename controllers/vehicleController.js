// controllers/vehicleController.js
// [TAUGHT: sem-2/Lect-32-combined-class/test.js & Lect-33-crud/controllers/gitController.js]
const Vehicle = require("../models/vehicleModel");
const Service = require("../models/serviceModel");

const vehicleController = {
    // 1. List vehicles (Fleet for Admin, Personal for Owner)
    getAllVehicles: async (req, res) => {
        try {
            const role = req.cookies.userRole;
            const ownerName = req.cookies.userName || "";
            const ownerEmail = req.cookies.userEmail || "";

            let vehicles;
            let pageTitle;

            if (role === "admin") {
                vehicles = await Vehicle.find().sort({ createdAt: -1 });
                pageTitle = "Workshop Fleet Inventory";
            } else {
                // Vehicle Owner sees their personal fleet
                vehicles = await Vehicle.find({
                    $or: [
                        { ownerEmail: ownerEmail },
                        { ownerName: { $regex: new RegExp("^" + ownerName.trim().split(" ")[0], "i") } }
                    ]
                }).sort({ createdAt: -1 });
                pageTitle = "My Registered Vehicles";
            }

            res.render("vehicles", { vehicles, pageTitle, role });
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            res.status(500).send("Database Error while fetching vehicles.");
        }
    },

    // 2. Render form to register vehicle
    renderAddVehicle: (req, res) => {
        const defaultOwnerName = req.cookies.userName || "";
        const defaultOwnerEmail = req.cookies.userEmail || "";
        res.render("addVehicle", {
            pageTitle: "Register New Vehicle",
            defaultOwnerName,
            defaultOwnerEmail
        });
    },

    // 3. Save new vehicle
    createVehicle: async (req, res) => {
        try {
            const vehicleData = {
                ...req.body,
                vehicleNumber: req.body.vehicleNumber.toUpperCase().trim(),
                ownerName: req.body.ownerName || req.cookies.userName || "Vehicle Owner",
                ownerEmail: req.cookies.userEmail || ""
            };
            await Vehicle.create(vehicleData);
            res.redirect("/vehicles");
        } catch (error) {
            console.error("Error registering vehicle:", error);
            res.status(500).send("Error saving vehicle. Please check if vehicle number is unique.");
        }
    },

    // 4. View per-vehicle complete history & total expense
    getVehicleHistory: async (req, res) => {
        try {
            const vehicleNumber = req.params.vehicleNumber.toUpperCase();
            const vehicle = await Vehicle.findOne({ vehicleNumber });
            const services = await Service.find({ vehicleNumber }).sort({ bookingDate: -1 });

            // Calculate total expenditure on this vehicle using Array.reduce [TAUGHT: sem-2/Lect-05]
            const totalSpent = services
                .filter(s => s.status === "Completed")
                .reduce((sum, s) => sum + (s.cost || 0), 0);

            res.render("vehicleHistory", {
                vehicle,
                vehicleNumber,
                services,
                totalSpent,
                pageTitle: `Service History - ${vehicleNumber}`
            });
        } catch (error) {
            console.error("Error fetching vehicle history:", error);
            res.status(500).send("Error loading vehicle history.");
        }
    },

    // 5. Delete vehicle
    deleteVehicle: async (req, res) => {
        try {
            await Vehicle.findByIdAndDelete(req.params.id);
            res.redirect("/vehicles");
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            res.status(500).send("Error deleting vehicle.");
        }
    }
};

module.exports = vehicleController;
