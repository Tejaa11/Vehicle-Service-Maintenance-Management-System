// middleware/authMiddleware.js
// [TAUGHT: sem-2/Lect-27-middleware & sem-3/Lect-15-nodejs-cookies]

const requireAuth = (req, res, next) => {
    if (!req.cookies || !req.cookies.userRole) {
        return res.redirect("/login?error=" + encodeURIComponent("Please sign in to access your portal."));
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.cookies || !req.cookies.userRole) {
        return res.redirect("/login?error=" + encodeURIComponent("Workshop Admin sign-in required."));
    }
    if (req.cookies.userRole !== "admin") {
        return res.redirect("/owner/dashboard?error=" + encodeURIComponent("Access denied. Admin rights required."));
    }
    next();
};

const requireOwner = (req, res, next) => {
    if (!req.cookies || !req.cookies.userRole) {
        return res.redirect("/login?error=" + encodeURIComponent("Please sign in as a Vehicle Owner to access your dashboard."));
    }
    if (req.cookies.userRole === "admin") {
        return res.redirect("/admin/dashboard");
    }
    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireOwner
};
