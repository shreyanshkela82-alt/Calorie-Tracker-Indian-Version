const express = require("express");
const router = express.Router();

const {
    updateProfile,
    getProfile
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");
const { validateProfile } = require("../middleware/validators");

// Get Profile
router.get("/", protect, getProfile);

// Update Profile
router.put("/", protect, validateProfile, updateProfile);

module.exports = router;
