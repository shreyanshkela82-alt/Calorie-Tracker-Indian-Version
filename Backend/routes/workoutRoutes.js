const express = require("express");
const router = express.Router();

const {
    addWorkout,
    getWorkouts,
    deleteWorkout
} = require("../controllers/workoutController");

const { protect } = require("../middleware/authMiddleware");
const { validateWorkout } = require("../middleware/validators");

// Get all workouts
router.get("/", protect, getWorkouts);

// Add workout
router.post("/", protect, validateWorkout, addWorkout);

// Delete workout
router.delete("/:id", protect, deleteWorkout);

module.exports = router;
