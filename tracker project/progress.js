const userProfile = JSON.parse(localStorage.getItem("userProfile"));

const consumedCalories = Number(localStorage.getItem("consumedCalories")) || 0;

const dailyTarget =
  Number(localStorage.getItem("dailyTarget")) ||
  (userProfile ? Number(userProfile.dailyCalories) : 0);

if (!userProfile) {
  alert("Please complete your profile first.");
  window.location.href = "profile.html";
}

const bmi = Number(userProfile.bmi);
const bmiStatus = userProfile.bmiStatus || "Pending";
const goal = userProfile.goal || "maintain";

const remainingCalories = dailyTarget - consumedCalories;
const extraCalories =
  consumedCalories > dailyTarget ? consumedCalories - dailyTarget : 0;

/* BASIC CARD VALUES */

document.getElementById("bmiValue").innerText = bmi || "--";
document.getElementById("bmiStatus").innerText = bmiStatus;

document.getElementById("dailyTarget").innerText = `${dailyTarget} kcal`;
document.getElementById("consumedCalories").innerText =
  `${consumedCalories} kcal`;

document.getElementById("goalType").innerText =
  goal === "lose" ? "Weight Loss" : "Maintain";

/* REMAINING / EXTRA LOGIC */

if (remainingCalories >= 0) {
  document.getElementById("remainingCalories").innerText =
    `${remainingCalories} kcal`;

  document.getElementById("remainingStatus").innerText =
    "Calories left for today";

  document.getElementById("calorieStatus").innerText = "On Track";

  document.getElementById("statusText").innerText =
    "You are within your daily calorie target.";

  document.getElementById("progressMessage").innerText =
    `Good progress! You still have ${remainingCalories} kcal left today. Keep tracking your meals consistently.`;
} else {
  document.getElementById("remainingCalories").innerText =
    `${extraCalories} kcal`;

  document.getElementById("remainingStatus").innerText =
    "Extra calories consumed";

  document.getElementById("calorieStatus").innerText = "Over Target";

  document.getElementById("statusText").innerText =
    "You crossed your daily calorie target.";

  document.getElementById("progressMessage").innerText =
    `You consumed ${extraCalories} kcal more than your target. Try opening the workout page to balance it.`;
}

/* BMI POINTER */

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

document.getElementById("bmiPointer").style.left = `${bmiPosition}%`;

/* CALORIE CHART */

const consumed = consumedCalories;
const remaining = remainingCalories > 0 ? remainingCalories : 0;
const extra = extraCalories;

new Chart(document.getElementById("calorieChart"), {
  type: "doughnut",
  data: {
    labels: ["Consumed", "Remaining", "Extra"],
    datasets: [
      {
        data: [consumed, remaining, extra],
        backgroundColor: ["#34a853", "#dff5e5", "#ff6b6b"],
        borderWidth: 0
      }
    ]
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

/* BMI CHART */

new Chart(document.getElementById("bmiChart"), {
  type: "bar",
  data: {
    labels: ["Your BMI", "Normal Min", "Normal Max"],
    datasets: [
      {
        label: "BMI Value",
        data: [bmi, 18.5, 24.9],
        backgroundColor: ["#34a853", "#7ec8ff", "#48c774"]
      }
    ]
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

/* REAL WEEKLY CALORIE DATA */

function getLast7DaysCalories() {
  const calorieHistory =
    JSON.parse(localStorage.getItem("calorieHistory")) || {};

  const labels = [];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dateKey = date.toISOString().split("T")[0];

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short"
    });

    labels.push(dayName);
    data.push(calorieHistory[dateKey] || 0);
  }

  return {
    labels: labels,
    data: data
  };
}

const weeklyData = getLast7DaysCalories();

/* WEEKLY CHART */

new Chart(document.getElementById("weeklyChart"), {
  type: "line",
  data: {
    labels: weeklyData.labels,
    datasets: [
      {
        label: "Calories Consumed",
        data: weeklyData.data,
        borderColor: "#34a853",
        backgroundColor: "rgba(52, 168, 83, 0.15)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Daily Target",
        data: [
          dailyTarget,
          dailyTarget,
          dailyTarget,
          dailyTarget,
          dailyTarget,
          dailyTarget,
          dailyTarget
        ],
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