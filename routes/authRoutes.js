// routes/authRoutes.js
// [TAUGHT: sem-2/Lect-33-crud/routes/gigRouter.js & Lect-34-crud/routes/userRoute.js]
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.renderLogin);
router.post("/login", authController.login);
router.get("/register", authController.renderRegister);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

module.exports = router;
