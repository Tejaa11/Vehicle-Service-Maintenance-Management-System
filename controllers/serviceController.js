// controllers/serviceController.js
// [TAUGHT: sem-2/Lect-32-combined-class/test.js & Lect-33-crud/controllers/gitController.js]
const Service = require("../models/serviceModel");
const Vehicle = require("../models/vehicleModel");

const serviceController = {
    // 1. Public Landing Page / Smart Role Routing
    getLanding: (req, res) => {
        if (req.cookies && req.cookies.userRole === "admin") {
            return res.redirect("/admin/dashboard");
        }
        if (req.cookies && req.cookies.userRole === "owner") {
            return res.redirect("/owner/dashboard");
        }
        res.render("landing", { pageTitle: "Smart Vehicle Service & Workshop Operations" });
    },

    // 2. Vehicle Owner Dashboard (Personal Fleet & Bookings Only)
    getOwnerDashboard: async (req, res) => {
        try {
            const ownerName = req.cookies.userName || "";
            const ownerEmail = req.cookies.userEmail || "";

            // Find only vehicles registered to this vehicle owner
            const ownerQuery = [];
            if (ownerEmail) ownerQuery.push({ ownerEmail: ownerEmail.toLowerCase() });
            if (ownerName) ownerQuery.push({ ownerName: { $regex: new RegExp("^" + ownerName.trim().split(" ")[0], "i") } });

            const myVehicles = ownerQuery.length > 0 
                ? await Vehicle.find({ $or: ownerQuery }).sort({ createdAt: -1 })
                : [];

            const myVehicleNumbers = myVehicles.map(v => v.vehicleNumber);

            // Fetch only service requests for this owner's vehicles
            const myServices = myVehicleNumbers.length > 0 
                ? await Service.find({ vehicleNumber: { $in: myVehicleNumbers } }).sort({ bookingDate: -1 })
                : [];

            // Personal Owner Metrics
            const upcomingServices = myServices.filter(s => s.status === "Pending" || s.status === "Accepted");
            const completedServices = myServices.filter(s => s.status === "Completed");
            const totalServiceCost = completedServices.reduce((sum, s) => sum + (s.cost || 0), 0);

            // Stretch Goal: Service reminders based on mileage (>= 10,000 km) or date (>= 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const serviceReminders = myVehicles.filter(v => v.currentMileage >= 10000 || (v.purchaseDate && new Date(v.purchaseDate) <= sixMonthsAgo));

            res.render("dashboard", {
                allServices: myServices,
                allVehicles: myVehicles,
                upcomingServices,
                completedServices,
                totalServiceCost,
                serviceReminders,
                totalVehicles: myVehicles.length,
                pageTitle: "Vehicle Owner Portal"
            });
        } catch (error) {
            console.error("Error loading owner dashboard:", error);
            res.status(500).send("Database Error loading owner dashboard.");
        }
    },

    // 3. Service Center / Admin Managing Dashboard (Full Workshop View)
    getAdminDashboard: async (req, res) => {
        try {
            const allServices = await Service.find().sort({ bookingDate: -1 });
            const allVehicles = await Vehicle.find().sort({ createdAt: -1 });

            const pendingServices = allServices.filter(s => s.status === "Pending");
            const inProgressServices = allServices.filter(s => s.status === "Accepted");
            const completedServices = allServices.filter(s => s.status === "Completed");
            const totalRevenue = completedServices.reduce((sum, s) => sum + (s.cost || 0), 0);

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const serviceReminders = allVehicles.filter(v => v.currentMileage >= 10000 || (v.purchaseDate && new Date(v.purchaseDate) <= sixMonthsAgo));

            res.render("adminDashboard", {
                allServices,
                allVehicles,
                pendingServices,
                inProgressServices,
                completedServices,
                totalRevenue,
                serviceReminders,
                totalVehicles: allVehicles.length,
                pageTitle: "Service Center Admin Dashboard"
            });
        } catch (error) {
            console.error("Error loading admin dashboard:", error);
            res.status(500).send("Database Error loading admin dashboard.");
        }
    },

    // 4. Render booking / report problem form (Filtered for logged-in owner)
    renderBookService: async (req, res) => {
        try {
            const role = req.cookies.userRole;
            let vehicles;

            if (role === "admin") {
                vehicles = await Vehicle.find().sort({ vehicleNumber: 1 });
            } else {
                const ownerName = req.cookies.userName || "";
                const ownerEmail = req.cookies.userEmail || "";
                const ownerQuery = [];
                if (ownerEmail) ownerQuery.push({ ownerEmail: ownerEmail.toLowerCase() });
                if (ownerName) ownerQuery.push({ ownerName: { $regex: new RegExp("^" + ownerName.trim().split(" ")[0], "i") } });

                vehicles = ownerQuery.length > 0
                    ? await Vehicle.find({ $or: ownerQuery }).sort({ vehicleNumber: 1 })
                    : [];
            }

            const prefillVehicle = req.query.vehicle || "";
            res.render("bookService", {
                vehicles,
                prefillVehicle,
                pageTitle: "Book Service / Report Problem"
            });
        } catch (error) {
            console.error("Error loading booking form:", error);
            res.status(500).send("Error loading booking page.");
        }
    },

    // 5. Create service booking / report problem
    bookService: async (req, res) => {
        try {
            await Service.create(req.body);
            if (req.cookies && req.cookies.userRole === "admin") {
                return res.redirect("/admin/dashboard");
            }
            res.redirect("/owner/dashboard");
        } catch (error) {
            console.error("Error booking service:", error);
            res.status(500).send("Validation or Database Error while booking service.");
        }
    },

    // 4. Service Center Portal: View and manage all incoming service requests
    listAdminServices: async (req, res) => {
        try {
            const services = await Service.find().sort({ bookingDate: -1 });
            res.render("adminServices", {
                services,
                pageTitle: "Service Center Operations"
            });
        } catch (error) {
            console.error("Error loading service center portal:", error);
            res.status(500).send("Error loading service center portal.");
        }
    },

    // 5. Accept or Reject service request (1-click status update)
    updateServiceStatus: async (req, res) => {
        try {
            const { status } = req.query; // ?status=Accepted or ?status=Rejected
            await Service.findByIdAndUpdate(req.params.id, { status });
            res.redirect("/admin/services");
        } catch (error) {
            console.error("Error updating service status:", error);
            res.status(500).send("Error updating service status.");
        }
    },

    // 6. Render form to complete service record with parts replaced and cost
    renderCompleteService: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).send("Service record not found.");
            }
            res.render("completeService", {
                service,
                pageTitle: `Complete Service #${service.id.slice(-5)}`
            });
        } catch (error) {
            console.error("Error loading completion form:", error);
            res.status(500).send("Error loading service record.");
        }
    },

    // 7. Save parts replaced, cost, and mark service as Completed
    completeService: async (req, res) => {
        try {
            const { partsReplaced, cost, notes } = req.body;
            await Service.findByIdAndUpdate(req.params.id, {
                partsReplaced,
                cost: Number(cost) || 0,
                notes,
                status: "Completed",
                serviceDate: new Date()
            });
            res.redirect("/admin/services");
        } catch (error) {
            console.error("Error completing service record:", error);
            res.status(500).send("Error saving service record.");
        }
    }
};

module.exports = serviceController;
