/* ===========================
   AUTH CHECK
=========================== */

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "index.html";
}

/* ===========================
   GLOBAL VARIABLES
=========================== */

let profile = null;
let progressList = [];

let bmi = 0;
let bmiStatus = "";
let goal = "";

let consumedCalories = 0;
let burnedCalories = 0;
let dailyTarget = 0;

let remainingCalories = 0;
let extraCalories = 0;

/* ===========================
   LOAD PAGE
=========================== */

window.addEventListener("DOMContentLoaded", () => {
    loadProgressPage();
});



/* ===========================
   LOAD PROFILE
=========================== */

async function loadProfile() {

    const response = await fetch(
        "https://indian-calorie-tracker-api.onrender.com/api/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    console.log("PROFILE RESPONSE:", data);

    if (!data.success) {

        alert("Please complete your profile.");

        window.location.href = "profile.html";

        return;

    }

    profile = data.user;

}
/* ===========================
   LOAD PROGRESS
=========================== */

async function loadProgress() {

    try {

        const response = await fetch(
            "https://indian-calorie-tracker-api.onrender.com/api/progress",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        progressList = Array.isArray(data.progress) ? data.progress : [];

    } catch (err) {

        console.error(err);
        progressList = [];

    }
}

/* ===========================
   CALCULATE VALUES
=========================== */

function calculateValues() {

    if (!profile) {
        console.error("Profile not loaded");
        return;
    }

    bmi = Number(profile.bmi || 0);
    bmiStatus = profile.bmiStatus || "Pending";
    goal = profile.goal || "maintain";

    if (!Array.isArray(progressList)) {
        progressList = [];
    }

    if (progressList.length > 0) {

        const latest = progressList[progressList.length - 1];

        consumedCalories = latest.caloriesConsumed || 0;
        burnedCalories = latest.caloriesBurned || 0;
        dailyTarget = latest.targetCalories || profile.dailyCalories || 0;

    } else {

        consumedCalories = 0;
        burnedCalories = 0;
        dailyTarget = Number(profile.dailyCalories) || 0;

    }

    remainingCalories = dailyTarget - consumedCalories;
    extraCalories = Math.max(0, consumedCalories - dailyTarget);
}

/* ===========================
   UPDATE SUMMARY CARDS
=========================== */

function updateCards() {

    document.getElementById("bmiValue").innerText =
        bmi ? bmi.toFixed(1) : "--";

    document.getElementById("bmiStatus").innerText =
        bmiStatus;

    document.getElementById("dailyTarget").innerText =
        `${dailyTarget} kcal`;

    document.getElementById("consumedCalories").innerText =
        `${consumedCalories} kcal`;

    document.getElementById("goalType").innerText =
        goal === "lose"
            ? "Weight Loss"
            : "Maintain";

    if (remainingCalories >= 0) {

        document.getElementById("remainingCalories").innerText =
            `${remainingCalories} kcal`;

        document.getElementById("remainingStatus").innerText =
            "Calories left for today";

        document.getElementById("calorieStatus").innerText =
            "On Track";

        document.getElementById("statusText").innerText =
            "You are within your daily calorie target.";

        document.getElementById("progressMessage").innerText =
            `Good progress! You still have ${remainingCalories} kcal left today. Keep tracking your meals consistently.`;

    } else {

        document.getElementById("remainingCalories").innerText =
            `${extraCalories} kcal`;

        document.getElementById("remainingStatus").innerText =
            "Extra calories consumed";

        document.getElementById("calorieStatus").innerText =
            "Over Target";

        document.getElementById("statusText").innerText =
            "You crossed your daily calorie target.";

        document.getElementById("progressMessage").innerText =
            `You consumed ${extraCalories} kcal more than your target. Try opening the workout page to balance it.`;

    }

}
/* ===========================
   BMI POINTER
=========================== */

function updateBMIPointer() {

    let bmiPosition = 0;

    if (bmi < 18.5) {
        bmiPosition = 12;
    } else if (bmi < 25) {
        bmiPosition = 37;
    } else if (bmi < 30) {
        bmiPosition = 62;
    } else {
        bmiPosition = 87;
    }

    document.getElementById("bmiPointer").style.left =
        `${bmiPosition}%`;

}

/* ===========================
   CALORIE DOUGHNUT CHART
=========================== */

function drawCalorieChart() {

    const remaining =
        remainingCalories > 0 ? remainingCalories : 0;

    const extra =
        extraCalories > 0 ? extraCalories : 0;

    new Chart(document.getElementById("calorieChart"), {

        type: "doughnut",

        data: {

            labels: [
                "Consumed",
                "Remaining",
                "Extra"
            ],

            datasets: [{
                data: [
                    consumedCalories,
                    remaining,
                    extra
                ],

                backgroundColor: [
                    "#34a853",
                    "#dff5e5",
                    "#ff6b6b"
                ],

                borderWidth: 0

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}

/* ===========================
   BMI BAR CHART
=========================== */

function drawBMIChart() {

    new Chart(document.getElementById("bmiChart"), {

        type: "bar",

        data: {

            labels: [
                "Your BMI",
                "Normal Min",
                "Normal Max"
            ],

            datasets: [{

                label: "BMI Value",

                data: [
                    bmi,
                    18.5,
                    24.9
                ],

                backgroundColor: [
                    "#34a853",
                    "#7ec8ff",
                    "#48c774"
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 40

                }

            }

        }

    });

}
/* ===========================
   WEEKLY CALORIE CHART
=========================== */

function drawWeeklyChart() {

    const labels = [];
    const calories = [];
    const targets = [];

    progressList.forEach((item) => {

        const day = new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short"
        });

        labels.push(day);
        calories.push(item.caloriesConsumed);
        targets.push(item.targetCalories);

    });

    if (labels.length === 0) {

        for (let i = 6; i >= 0; i--) {

            const date = new Date();
            date.setDate(date.getDate() - i);

            labels.push(
                date.toLocaleDateString("en-US", {
                    weekday: "short"
                })
            );

            calories.push(0);
            targets.push(dailyTarget);

        }

    }

    new Chart(document.getElementById("weeklyChart"), {

        type: "line",

        data: {

            labels,

            datasets: [

                {
                    label: "Calories Consumed",
                    data: calories,
                    borderColor: "#34a853",
                    backgroundColor: "rgba(52,168,83,0.15)",
                    fill: true,
                    tension: 0.4
                },

                {
                    label: "Daily Target",
                    data: targets,
                    borderColor: "#ffb84d",
                    borderDash: [6, 6],
                    tension: 0.3
                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });

}

/* ===========================
   DRAW ALL CHARTS
=========================== */

function drawCharts() {

    updateBMIPointer();

    drawCalorieChart();

    drawBMIChart();

    drawWeeklyChart();

}

/* ===========================
   FINISH PAGE LOADING
=========================== */

async function loadProgressPage() {

    try {

        await loadProfile();

        await loadProgress();

        calculateValues();

        updateCards();

        drawCharts();

    } catch (error) {

        console.log(error);

        alert("Unable to load progress page.");

    }

}