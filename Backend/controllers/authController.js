const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    // Issue a token immediately so the user is logged in right after registering
    const token = generateToken(newUser._id);

    res.status(201).json({
        success: true,
        message: "Registration Successful",
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        // Deliberately the same message as "user not found" above so we
        // don't leak whether a given email is registered
        throw new ApiError(400, "Invalid email or password");
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = {
    registerUser,
    loginUser
};
