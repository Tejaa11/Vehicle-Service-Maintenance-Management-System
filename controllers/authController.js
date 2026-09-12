// controllers/authController.js
// [TAUGHT: sem-2/Lect-34-crud/app.js & sem-3/Lect-15-nodejs-cookies & Lect-16]
const User = require("../models/userModel");

// Ensure default admin account exists in database
const seedDefaultUsers = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@autocare.com" });
        if (!adminExists) {
            await User.create({
                name: "Workshop Service Center Admin",
                email: "admin@autocare.com",
                password: "admin123",
                role: "admin",
                phone: "+91 98765 00001"
            });
            console.log("Default admin account created: admin@autocare.com / admin123");
        }
    } catch (err) {
        console.error("Error seeding admin user:", err.message);
    }
};

seedDefaultUsers();

const authController = {
    // 1. Render Login Form
    renderLogin: (req, res) => {
        if (req.cookies && req.cookies.userRole) {
            return req.cookies.userRole === "admin" ? res.redirect("/admin/dashboard") : res.redirect("/owner/dashboard");
        }
        res.render("login", {
            pageTitle: "Sign In",
            error: req.query.error || null,
            success: req.query.success || null
        });
    },

    // 2. Process Login Submission (Strict Credential Verification)
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.redirect("/login?error=Please provide both email and password.");
            }

            const cleanEmail = email.trim().toLowerCase();
            const user = await User.findOne({ email: cleanEmail });

            // Verify both existence and password match
            if (!user || user.password !== password) {
                return res.redirect("/login?error=Invalid email or password. Please try again.");
            }

            // Set role, name, and email cookies [TAUGHT: sem-2/Lect-34 & sem-3/Lect-15]
            res.cookie("userRole", user.role);
            res.cookie("userName", user.name);
            res.cookie("userEmail", user.email);

            if (user.role === "admin") {
                return res.redirect("/admin/dashboard");
            } else {
                return res.redirect("/owner/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            res.redirect("/login?error=An unexpected error occurred during sign in.");
        }
    },

    // 3. Render Registration Form
    renderRegister: (req, res) => {
        res.render("register", {
            pageTitle: "Create Account",
            error: req.query.error || null
        });
    },

    // 4. Process Registration Submission
    register: async (req, res) => {
        try {
            const { name, email, password, role, phone } = req.body;
            if (!email || !password || !name) {
                return res.redirect("/register?error=Please fill all required fields.");
            }

            const cleanEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: cleanEmail });

            if (existingUser) {
                return res.redirect("/register?error=An account with this email already exists.");
            }

            // Public registrations are strictly Vehicle Owners. Admin access must be granted by existing admin.
            const newUser = await User.create({
                name: name.trim(),
                email: cleanEmail,
                password,
                role: "owner",
                phone: phone ? phone.trim() : ""
            });

            // Establish session for the new vehicle owner
            res.cookie("userRole", "owner");
            res.cookie("userName", newUser.name);
            res.cookie("userEmail", newUser.email);

            return res.redirect("/owner/dashboard");
        } catch (error) {
            console.error("Registration error:", error);
            res.redirect("/register?error=Failed to register account. Please check your details.");
        }
    },

    // 5. Logout
    logout: (req, res) => {
        res.clearCookie("userRole");
        res.clearCookie("userName");
        res.clearCookie("userEmail");
        res.redirect("/login?success=You have been successfully signed out.");
    }
};

module.exports = authController;
