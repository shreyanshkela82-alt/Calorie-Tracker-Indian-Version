const express = require("express");
const router = express.Router();

const {
    addMeal,
    getMeals,
    deleteMeal
} = require("../controllers/mealController");

const { protect } = require("../middleware/authMiddleware");
const { validateMeal } = require("../middleware/validators");

// Get all meals
router.get("/", protect, getMeals);

// Add a meal
router.post("/", protect, validateMeal, addMeal);

// Delete a meal
router.delete("/:id", protect, deleteMeal);

module.exports = router;
