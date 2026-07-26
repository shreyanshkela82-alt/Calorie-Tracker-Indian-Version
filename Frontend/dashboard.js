// ================================
// AUTHENTICATION
// ================================

const API_URL = "https://indian-calorie-tracker-api.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "index.html";
}

// ================================
// GLOBAL VARIABLES
// ================================

let userProfile = null;
let meals = [];
let consumedCalories = 0;
let targetCalories = 0;
let remainingCalories = 0;

// Indian Food Calories
const FOOD_CALORIES = {
    roti: 100,
    sabji: 120,
    rice: 1.3,
    dal: 150,
    papad: 40,
    gulabJamun: 150,
    rasgulla: 120,
    curd: 80,
    paneerSabji: 220
};

// ================================
// INITIALIZE DASHBOARD
// ================================

document.addEventListener("DOMContentLoaded", async () => {

    showCurrentDate();

    await loadProfile();

    await loadMeals();

});

// ================================
// CURRENT DATE
// ================================

function showCurrentDate() {

    const today = new Date();

    document.getElementById("dateBox").innerHTML =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

}

// ================================
// LOAD PROFILE
// ================================

async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/profile`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!data.success) {

            alert("Please complete your profile.");

            window.location.href = "profile.html";

            return;

        }

        userProfile = data.user;

        targetCalories = Number(userProfile.dailyCalories) || 0;

        updateDashboardCards();

    }

    catch (error) {

        console.log(error);

    }

}

// ================================
// LOAD MEALS
// ================================

async function loadMeals() {

    try {

        const response = await fetch(`${API_URL}/meals`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (data.success) {

            meals = data.meals;

            renderMealHistory();

            calculateCalories();

        }

    }

    catch (error) {

        console.log(error);

    }

}

// ================================
// CALCULATE CALORIES
// ================================

function calculateCalories() {

    const today = new Date().toISOString().split("T")[0];

    consumedCalories = meals
        .filter(meal => meal.date === today)
        .reduce((sum, meal) => sum + meal.calories, 0);

    remainingCalories = targetCalories - consumedCalories;

    updateDashboardCards();

}
// ======================================
// ADD INDIAN MEAL
// ======================================

async function addIndianMeal() {

    const today = new Date().toISOString().split("T")[0];

    const rotiQty = Number(document.getElementById("rotiQty").value) || 0;
    const sabjiQty = Number(document.getElementById("sabjiQty").value) || 0;
    const riceQty = Number(document.getElementById("riceQty").value) || 0;
    const dalQty = Number(document.getElementById("dalQty").value) || 0;
    const papadQty = Number(document.getElementById("papadQty").value) || 0;

    const otherFood = document.getElementById("otherFood").value;
    const otherQty = Number(document.getElementById("otherQty").value) || 0;

    let totalCalories = 0;
    let mealName = [];

    if (rotiQty > 0) {
        totalCalories += rotiQty * FOOD_CALORIES.roti;
        mealName.push(`${rotiQty} Roti`);
    }

    if (sabjiQty > 0) {
        totalCalories += sabjiQty * FOOD_CALORIES.sabji;
        mealName.push(`${sabjiQty} Sabji`);
    }

    if (riceQty > 0) {
        totalCalories += riceQty * FOOD_CALORIES.rice;
        mealName.push(`${riceQty}g Rice`);
    }

    if (dalQty > 0) {
        totalCalories += dalQty * FOOD_CALORIES.dal;
        mealName.push(`${dalQty} Dal`);
    }

    if (papadQty > 0) {
        totalCalories += papadQty * FOOD_CALORIES.papad;
        mealName.push(`${papadQty} Papad`);
    }

    if (otherFood !== "" && otherQty > 0) {

        totalCalories += FOOD_CALORIES[otherFood] * otherQty;

        const foodNames = {
            gulabJamun: "Gulab Jamun",
            rasgulla: "Rasgulla",
            curd: "Curd",
            paneerSabji: "Paneer Sabji"
        };

        mealName.push(`${otherQty} ${foodNames[otherFood]}`);
    }

    if (mealName.length === 0) {
        alert("Please add at least one food item.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/meals`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                name: mealName.join(", "),
                calories: totalCalories,
                date: today
            })

        });

        const data = await response.json();

        if (data.success) {

            clearMealForm();

            await loadMeals();

        } else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

// ======================================
// CLEAR MEAL FORM
// ======================================

function clearMealForm() {

    document.getElementById("rotiQty").value = "";
    document.getElementById("sabjiQty").value = "";
    document.getElementById("riceQty").value = "";
    document.getElementById("dalQty").value = "";
    document.getElementById("papadQty").value = "";
    document.getElementById("otherFood").value = "";
    document.getElementById("otherQty").value = "";

}
// ======================================
// RENDER MEAL HISTORY
// ======================================

function renderMealHistory() {

    const mealList = document.getElementById("mealList");

    if (!mealList) return;

    const today = new Date().toISOString().split("T")[0];

    const todayMeals = meals.filter(meal => meal.date === today);

    if (todayMeals.length === 0) {

        mealList.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No meals added today.
                </td>
            </tr>
        `;

        return;
    }

    mealList.innerHTML = todayMeals.map(meal => `

        <tr>

            <td>${meal.name}</td>

            <td>${meal.calories} kcal</td>

            <td>${meal.date}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteMeal('${meal._id}')">

                    Delete

                </button>

            </td>

        </tr>

    `).join("");

}

// ======================================
// DELETE MEAL
// ======================================

async function deleteMeal(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this meal?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(

            `${API_URL}/meals/${id}`,

            {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        const data = await response.json();

        if (data.success) {

            await loadMeals();

        } else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

    }

}
// ======================================
// UPDATE DASHBOARD CARDS
// ======================================

function updateDashboardCards() {

    if (!userProfile) return;

    // Weight
    document.getElementById("weightValue").innerText =
        `${userProfile.weight || "--"} kg`;

    // BMI
    const height = Number(userProfile.height);
    const weight = Number(userProfile.weight);

    if (height > 0 && weight > 0) {

        const bmi = weight / ((height / 100) * (height / 100));

        document.getElementById("bmiValue").innerText =
            bmi.toFixed(1);

        let bmiStatus = "Normal";

        if (bmi < 18.5)
            bmiStatus = "Underweight";
        else if (bmi >= 25 && bmi < 30)
            bmiStatus = "Overweight";
        else if (bmi >= 30)
            bmiStatus = "Obese";

        document.getElementById("bmiStatus").innerText =
            bmiStatus;

    }

    // Daily Target
    document.getElementById("targetCalories").innerText =
        `${targetCalories} kcal`;

    // Remaining Calories

    if (remainingCalories >= 0) {

        document.getElementById("remainingCalories").innerText =
            `${remainingCalories} kcal`;

        document.getElementById("remainingStatus").innerText =
            "Safe to consume";

    }

    else {

        document.getElementById("remainingCalories").innerText =
            `${Math.abs(remainingCalories)} kcal`;

        document.getElementById("remainingStatus").innerText =
            "Over target";

    }

    // Progress Text

    const consumedText =
        document.getElementById("consumedText");

    if (consumedText) {

        consumedText.innerText =
            `${consumedCalories} / ${targetCalories} kcal consumed`;

    }

    // Progress Bar

    updateProgressBar();

    // Smart Alert

    updateSmartAlert();

    // Workout Recommendation

    updateWorkoutSuggestion();

}

// ======================================
// UPDATE PROGRESS BAR
// ======================================

function updateProgressBar() {

    const progress =
        document.getElementById("calorieProgress");

    if (!progress) return;

    let percent = 0;

    if (targetCalories > 0) {

        percent =
            (consumedCalories / targetCalories) * 100;

    }

    if (percent > 100)
        percent = 100;

    progress.style.width = percent + "%";

}
// ======================================
// WELCOME MESSAGE
// ======================================

function updateWelcomeMessage() {

    const welcome = document.getElementById("welcomeText");

    if (!welcome || !userProfile) return;

    const hour = new Date().getHours();

    let greeting = "Welcome";

    if (hour < 12)
        greeting = "Good Morning";
    else if (hour < 17)
        greeting = "Good Afternoon";
    else
        greeting = "Good Evening";

    welcome.innerHTML = `👋 ${greeting}, ${userProfile.name}!`;

}

// ======================================
// SETUP MESSAGE
// ======================================

function updateSetupMessage() {

    const setup = document.getElementById("setupMsg");

    if (!setup) return;

    if (!userProfile.weight || !userProfile.height) {

        setup.innerHTML =
            "⚠ Complete your profile to unlock personalized calorie tracking.";

    }

    else {

        setup.innerHTML =
            "✅ Profile completed. Keep logging meals to stay on track.";

    }

}

// ======================================
// SMART HEALTH ALERT
// ======================================

function updateSmartAlert() {

    const alertBox = document.getElementById("smartAlert");

    if (!alertBox) return;

    if (consumedCalories === 0) {

        alertBox.innerHTML =
            "🍽 Start logging today's meals to receive personalized insights.";

        return;

    }

    if (remainingCalories > 500) {

        alertBox.innerHTML =
            "🥗 You still have plenty of calories left today. A healthy snack is okay.";

    }

    else if (remainingCalories > 0) {

        alertBox.innerHTML =
            "✅ Great job! You're close to reaching today's calorie goal.";

    }

    else {

        alertBox.innerHTML =
            "⚠ You've exceeded today's calorie target. Consider a light workout.";

    }

}

// ======================================
// WORKOUT RECOMMENDATION
// ======================================

function updateWorkoutSuggestion() {

    const suggestion =
        document.getElementById("workoutSuggestion");

    if (!suggestion) return;

    if (remainingCalories > 500) {

        suggestion.innerHTML = `
            <p>
                🚶‍♂️ Light Walk (20–30 min)
            </p>
            <div class="open-workout-btn">
                Open Workout Page →
            </div>
        `;

    }

    else if (remainingCalories > 0) {

        suggestion.innerHTML = `
            <p>
                🏃 Jogging (30 min)
            </p>
            <div class="open-workout-btn">
                Open Workout Page →
            </div>
        `;

    }

    else {

        suggestion.innerHTML = `
            <p>
                🔥 HIIT Workout (30–40 min)
            </p>
            <div class="open-workout-btn">
                Open Workout Page →
            </div>
        `;

    }

}

// ======================================
// INITIALIZE UI
// ======================================

function initializeUI() {

    updateWelcomeMessage();

    updateSetupMessage();

    updateDashboardCards();

}
// ======================================
// CLEAR TODAY'S MEALS
// ======================================

async function clearTodayMeals() {

    if (!confirm("Delete all today's meals?")) return;

    const today = new Date().toISOString().split("T")[0];

    try {

        const todayMeals = meals.filter(meal => meal.date === today);

        for (const meal of todayMeals) {

            await fetch(`${API_URL}/meals/${meal._id}`, {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

        }

        await loadMeals();

        alert("Today's meals cleared successfully.");

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================
// RESET ALL DATA
// ======================================

function resetAllData() {

    const confirmReset = confirm(
        "This will clear local progress data. Continue?"
    );

    if (!confirmReset) return;

    localStorage.removeItem("consumedCalories");
    localStorage.removeItem("calorieHistory");

    location.reload();

}

// ======================================
// LOGOUT
// ======================================

function logoutUser() {

    const logout = confirm(
        "Are you sure you want to logout?"
    );

    if (!logout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");

    window.location.href = "index.html";

}

// ======================================
// SIDEBAR TOGGLE
// ======================================

const toggleBtn = document.getElementById("toggleBtn");

if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

        document
            .querySelector(".dashboard")
            .classList.toggle("collapsed");

    });

}

// ======================================
// INITIALIZE UI AFTER DATA LOAD
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    showCurrentDate();

    await loadProfile();

    await loadMeals();

    initializeUI();

});

// ======================================
// END OF FILE
// ======================================