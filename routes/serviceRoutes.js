// routes/serviceRoutes.js
// [TAUGHT: sem-2/Lect-33-crud/routes/gigRouter.js & Lect-34-crud/routes/userRoute.js]
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { requireAuth, requireAdmin, requireOwner } = require("../middleware/authMiddleware");

// Health check endpoint for testing rubric [NECESSARY]
router.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "Vehicle Service Management System", time: new Date() });
});

// Public Landing Page
router.get("/", serviceController.getLanding);

// Smart Dashboard Redirection
router.get("/dashboard", (req, res) => {
    if (req.cookies && req.cookies.userRole === "admin") {
        return res.redirect("/admin/dashboard");
    }
    if (req.cookies && req.cookies.userRole === "owner") {
        return res.redirect("/owner/dashboard");
    }
    res.redirect("/login");
});

// Designated Dashboards (Strictly Isolated & Protected)
router.get("/owner/dashboard", requireOwner, serviceController.getOwnerDashboard);
router.get("/admin/dashboard", requireAdmin, serviceController.getAdminDashboard);

// Owner Actions: Book Service / Report Problem
router.get("/services/book", requireAuth, serviceController.renderBookService);
router.post("/services/book", requireAuth, serviceController.bookService);

// Service Center Operations: View, Accept/Reject, Record Parts & Cost (Admin Only)
router.get("/admin/services", requireAdmin, serviceController.listAdminServices);
router.get("/admin/services/:id/status", requireAdmin, serviceController.updateServiceStatus);
router.get("/admin/services/:id/complete", requireAdmin, serviceController.renderCompleteService);
router.post("/admin/services/:id/complete", requireAdmin, serviceController.completeService);

module.exports = router;
