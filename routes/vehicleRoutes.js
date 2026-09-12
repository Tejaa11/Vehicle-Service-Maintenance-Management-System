// routes/vehicleRoutes.js
// [TAUGHT: sem-2/Lect-33-crud/routes/gigRouter.js & Lect-34-crud/routes/userRoute.js]
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/vehicles", requireAuth, vehicleController.getAllVehicles);
router.get("/vehicles/add", requireAuth, vehicleController.renderAddVehicle);
router.post("/vehicles/add", requireAuth, vehicleController.createVehicle);
router.get("/vehicles/:vehicleNumber/history", requireAuth, vehicleController.getVehicleHistory);
router.get("/vehicles/delete/:id", requireAdmin, vehicleController.deleteVehicle);

module.exports = router;
