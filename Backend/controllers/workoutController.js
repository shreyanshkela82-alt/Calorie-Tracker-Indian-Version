const Workout = require("../models/Workout");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { syncDailyProgress } = require("../utils/progressSync");

// Add Workout
const addWorkout = asyncHandler(async (req, res) => {
    const { workoutName, caloriesBurned, duration, date } = req.body;

    const workout = await Workout.create({
        user: req.user._id,
        workoutName,
        caloriesBurned,
        duration,
        date
    });

    // Keep Progress.caloriesBurned in sync (previously workouts never
    // updated Progress, so this number silently stayed at 0)
    await syncDailyProgress(req.user._id, date);

    res.status(201).json({
        success: true,
        message: "Workout added successfully",
        workout
    });
});

// Get All Workouts of Logged-in User (optionally filtered by ?date=YYYY-MM-DD)
const getWorkouts = asyncHandler(async (req, res) => {
    const filter = { user: req.user._id };
    if (req.query.date) filter.date = req.query.date;

    const workouts = await Workout.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        workouts
    });
});

// Delete Workout
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        throw new ApiError(404, "Workout not found");
    }

    if (workout.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this workout");
    }

    const workoutDate = workout.date;

    await workout.deleteOne();
    await syncDailyProgress(req.user._id, workoutDate);

    res.status(200).json({
        success: true,
        message: "Workout deleted successfully"
    });
});

module.exports = {
    addWorkout,
    getWorkouts,
    deleteWorkout
};
