// Calculates recommended daily calories using the Mifflin-St Jeor equation,
// which is the most widely used and accurate BMR formula for general use.
// Doing this server-side (rather than trusting a client-submitted number)
// keeps the calculation consistent and tamper-proof.

const ACTIVITY_MULTIPLIERS = {
    "1.2": 1.2,   // Sedentary (little/no exercise)
    "1.375": 1.375, // Light activity (1-3 days/week)
    "1.55": 1.55, // Moderate activity (3-5 days/week)
    "1.725": 1.725, // Very active (6-7 days/week)
    "1.9": 1.9    // Extra active (athlete / physical job)
};

const GOAL_ADJUSTMENTS = {
    lose: -500,   // ~0.5kg/week deficit
    gain: 500,    // ~0.5kg/week surplus
    maintain: 0
};

function calculateBMR({ weight, height, age, gender }) {
    // Mifflin-St Jeor Equation
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === "female" ? base - 161 : base + 5;
}

function calculateDailyCalories({ weight, height, age, gender, activity, goal }) {
    const bmr = calculateBMR({ weight, height, age, gender });
    const multiplier = ACTIVITY_MULTIPLIERS[String(activity)] || 1.2;
    const tdee = bmr * multiplier;
    const adjustment = GOAL_ADJUSTMENTS[goal] || 0;

    const dailyCalories = Math.round(tdee + adjustment);

    // Never recommend a dangerously low calorie target
    return Math.max(dailyCalories, 1200);
}

function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Number(bmi.toFixed(1));
}

function getBMIStatus(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

module.exports = {
    calculateBMR,
    calculateDailyCalories,
    calculateBMI,
    getBMIStatus
};
