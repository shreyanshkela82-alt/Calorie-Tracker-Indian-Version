const express = require("express");
const router = express.Router();

const {
    saveProgress,
    getProgress,
    deleteProgress
} = require("../controllers/progressController");

const { protect } = require("../middleware/authMiddleware");

// Get all progress
router.get("/", protect, getProgress);

// Save or Update Progress
router.post("/", protect, saveProgress);

// Delete Progress
router.delete("/:id", protect, deleteProgress);

module.exports = router;