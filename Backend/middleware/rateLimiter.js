const rateLimit = require("express-rate-limit");

// Limits login/register attempts to slow down brute-force and credential
// stuffing attacks. 20 attempts per 15 minutes per IP is generous for a
// real user but restrictive enough to blunt automated attacks.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many attempts. Please try again in a few minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { authLimiter };
