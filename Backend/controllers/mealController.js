const Meal = require("../models/Meal");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { syncDailyProgress } = require("../utils/progressSync");

// Add Meal
const addMeal = asyncHandler(async (req, res) => {
    const { name, calories, date } = req.body;

    const meal = await Meal.create({
        user: req.user._id,
        name,
        calories,
        date
    });

    await syncDailyProgress(req.user._id, date);

    res.status(201).json({
        success: true,
        message: "Meal added successfully",
        meal
    });
});

// Get All Meals (optionally filtered by ?date=YYYY-MM-DD)
const getMeals = asyncHandler(async (req, res) => {
    const filter = { user: req.user._id };
    if (req.query.date) filter.date = req.query.date;

    const meals = await Meal.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        meals
    });
});

// Delete Meal
const deleteMeal = asyncHandler(async (req, res) => {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
        throw new ApiError(404, "Meal not found");
    }

    if (meal.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this meal");
    }

    const mealDate = meal.date;

    await meal.deleteOne();
    await syncDailyProgress(req.user._id, mealDate);

    res.status(200).json({
        success: true,
        message: "Meal deleted successfully"
    });
});

module.exports = {
    addMeal,
    getMeals,
    deleteMeal
};
