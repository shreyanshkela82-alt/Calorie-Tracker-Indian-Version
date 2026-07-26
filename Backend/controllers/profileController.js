const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
    calculateDailyCalories,
    calculateBMI,
    getBMIStatus
} = require("../utils/calorieCalculator");

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
    const { age, gender, height, weight, activity, goal } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update Profile Fields
    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.activity = activity;
    user.goal = goal;

    // ===== Calculate BMI =====
    user.bmi = calculateBMI(Number(weight), Number(height));
    user.bmiStatus = getBMIStatus(user.bmi);

    // ===== Calculate Daily Calorie Target (Mifflin-St Jeor) =====
    // Calculated server-side so it can't be spoofed by the client and
    // always stays consistent with the user's actual stats.
    user.dailyCalories = calculateDailyCalories({
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
        gender,
        activity,
        goal
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({
        success: true,
        user
    });
});

module.exports = {
    updateProfile,
    getProfile
};
