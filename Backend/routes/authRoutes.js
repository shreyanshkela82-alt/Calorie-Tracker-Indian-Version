const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const { validateRegister, validateLogin } = require("../middleware/validators");
const { authLimiter } = require("../middleware/rateLimiter");

// Register Route
router.post("/register", authLimiter, validateRegister, registerUser);

// Login Route
router.post("/login", authLimiter, validateLogin, loginUser);

module.exports = router;
