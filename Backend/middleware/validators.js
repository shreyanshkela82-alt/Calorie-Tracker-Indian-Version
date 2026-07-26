const ApiError = require("../utils/ApiError");

// Simple, dependency-free validators. Each returns Express middleware.
// Kept intentionally lightweight for a portfolio project rather than
// pulling in a full validation library.

const isNonEmptyString = (val) => typeof val === "string" && val.trim().length > 0;
const isValidEmail = (val) => typeof val === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPositiveNumber = (val) => val !== undefined && val !== null && val !== "" && !isNaN(val) && Number(val) > 0;

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name)) {
        return next(new ApiError(400, "Name is required"));
    }
    if (!isValidEmail(email)) {
        return next(new ApiError(400, "A valid email is required"));
    }
    if (!isNonEmptyString(password) || password.length < 6) {
        return next(new ApiError(400, "Password must be at least 6 characters"));
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
        return next(new ApiError(400, "Please provide a valid email and password"));
    }

    next();
};

const validateProfile = (req, res, next) => {
    const { age, height, weight, gender, activity } = req.body;

    if (age !== undefined && age !== null && age !== "" && (!isPositiveNumber(age) || age > 120)) {
        return next(new ApiError(400, "Age must be a realistic positive number"));
    }
    if (height !== undefined && height !== null && height !== "" && (!isPositiveNumber(height) || height > 300)) {
        return next(new ApiError(400, "Height must be a realistic value in cm"));
    }
    if (weight !== undefined && weight !== null && weight !== "" && (!isPositiveNumber(weight) || weight > 500)) {
        return next(new ApiError(400, "Weight must be a realistic value in kg"));
    }
    if (gender !== undefined && !["male", "female", "other"].includes(String(gender).toLowerCase())) {
        return next(new ApiError(400, "Gender must be male, female, or other"));
    }
    if (activity !== undefined && isNaN(Number(activity))) {
        return next(new ApiError(400, "Activity level must be numeric"));
    }

    next();
};

const validateMeal = (req, res, next) => {
    const { name, calories, date } = req.body;

    if (!isNonEmptyString(name)) {
        return next(new ApiError(400, "Meal name is required"));
    }
    if (!isPositiveNumber(calories)) {
        return next(new ApiError(400, "Calories must be a positive number"));
    }
    if (!isNonEmptyString(date)) {
        return next(new ApiError(400, "Date is required"));
    }

    next();
};

const validateWorkout = (req, res, next) => {
    const { workoutName, caloriesBurned, duration, date } = req.body;

    if (!isNonEmptyString(workoutName)) {
        return next(new ApiError(400, "Workout name is required"));
    }
    if (!isPositiveNumber(caloriesBurned)) {
        return next(new ApiError(400, "Calories burned must be a positive number"));
    }
    if (!isPositiveNumber(duration)) {
        return next(new ApiError(400, "Duration must be a positive number"));
    }
    if (!isNonEmptyString(date)) {
        return next(new ApiError(400, "Date is required"));
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProfile,
    validateMeal,
    validateWorkout
};
