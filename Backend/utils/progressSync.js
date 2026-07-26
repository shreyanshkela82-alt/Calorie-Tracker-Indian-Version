const Meal = require("../models/Meal");
const Workout = require("../models/Workout");
const Progress = require("../models/Progress");
const User = require("../models/User");

// Recalculates a user's Progress document for a given date from their
// actual meals and workouts. Called any time a meal or workout is added
// or removed, so caloriesConsumed / caloriesBurned never drift out of sync
// with the underlying data (previously only meals triggered this, so
// caloriesBurned was never kept up to date by the workout routes).
const syncDailyProgress = async (userId, date) => {
    const [meals, workouts, user] = await Promise.all([
        Meal.find({ user: userId, date }),
        Workout.find({ user: userId, date }),
        User.findById(userId)
    ]);

    const caloriesConsumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const caloriesBurned = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    const targetCalories = (user && user.dailyCalories) || 0;

    const progress = await Progress.findOneAndUpdate(
        { user: userId, date },
        { caloriesConsumed, caloriesBurned, targetCalories },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return progress;
};

module.exports = { syncDailyProgress };
