let consumedCalories = Number(localStorage.getItem("consumedCalories")) || 0;
let meals = JSON.parse(localStorage.getItem("meals")) || [];

/* DAILY RESET LOGIC */

const todayKey = new Date().toISOString().split("T")[0];
const lastSavedDate = localStorage.getItem("lastSavedDate");

if (lastSavedDate !== todayKey) {
  consumedCalories = 0;
  meals = [];

  localStorage.setItem("consumedCalories", consumedCalories);
  localStorage.setItem("meals", JSON.stringify(meals));
  localStorage.setItem("lastSavedDate", todayKey);
}

const profile = JSON.parse(localStorage.getItem("userProfile"));

const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.querySelector(".sidebar");

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
  });
}

const today = new Date();
document.getElementById("dateBox").innerHTML = today.toDateString();

let dailyTarget = 0;

if (!profile) {
  document.getElementById("setupMsg").style.display = "block";
  document.getElementById("setupMsg").innerText =
    "Please complete your profile first to generate your calorie plan.";
} else {
  document.getElementById("welcomeText").innerText =
    `👋 Welcome back, ${profile.name}`;

  document.getElementById("weightValue").innerText = `${profile.weight} kg`;

  const heightInMeter = profile.height / 100;
  const bmi = profile.weight / (heightInMeter * heightInMeter);

  document.getElementById("bmiValue").innerText = bmi.toFixed(1);

  let status = "Healthy";

  if (bmi < 18.5) {
    status = "Underweight";
  } else if (bmi >= 25) {
    status = "Overweight";
  }

  document.getElementById("bmiStatus").innerText = status;

  dailyTarget = Number(profile.dailyCalories);

  document.getElementById("targetCalories").innerText = `${dailyTarget} kcal`;
}

const foodCalories = {
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

const foodNames = {
  gulabJamun: "Gulab Jamun",
  rasgulla: "Rasgulla",
  curd: "Curd",
  paneerSabji: "Paneer Sabji"
};

/* SAVE DAILY CALORIE HISTORY */

function getTodayKey() {
  return todayKey;
}

function saveDailyCalories(calories) {
  const currentDate = getTodayKey();

  let calorieHistory =
    JSON.parse(localStorage.getItem("calorieHistory")) || {};

  calorieHistory[currentDate] =
    (calorieHistory[currentDate] || 0) + calories;

  if (calorieHistory[currentDate] < 0) {
    calorieHistory[currentDate] = 0;
  }

  localStorage.setItem("calorieHistory", JSON.stringify(calorieHistory));
}

function updateDashboard() {
  const remaining = dailyTarget - consumedCalories;
  const extraCalories = consumedCalories - dailyTarget;

  document.getElementById("remainingCalories").innerText = `${remaining} kcal`;

  const remainingStatus = document.getElementById("remainingStatus");

  if (remainingStatus) {
    if (dailyTarget === 0) {
      remainingStatus.innerText = "Profile required";
    } else if (remaining >= 0) {
      remainingStatus.innerText = "Safe to consume";
    } else {
      remainingStatus.innerText = "Over target";
    }
  }

  document.getElementById("consumedText").innerText =
    `${consumedCalories} / ${dailyTarget} kcal consumed`;

  localStorage.setItem("consumedCalories", consumedCalories);
  localStorage.setItem("dailyTarget", dailyTarget);
  localStorage.setItem("extraCalories", extraCalories > 0 ? extraCalories : 0);
  localStorage.setItem("meals", JSON.stringify(meals));
  localStorage.setItem("lastSavedDate", todayKey);

  let progress = dailyTarget > 0 ? (consumedCalories / dailyTarget) * 100 : 0;

  if (progress > 100) {
    progress = 100;
  }

  document.getElementById("calorieProgress").style.width = progress + "%";

  const mealList = document.getElementById("mealList");
  mealList.innerHTML = "";

  if (meals.length === 0) {
    mealList.innerHTML = `
      <div class="empty-meal">
        <h4>No meals added today</h4>
        <p>Start by adding your first meal to track calories.</p>
      </div>
    `;
  } else {
    meals.forEach(function (meal, index) {
      mealList.innerHTML += `
        <div class="meal-item">
          <span>${meal.name}</span>
          <strong>${meal.calories} kcal</strong>
          <button class="delete-btn" onclick="deleteMeal(${index})">Delete</button>
        </div>
      `;
    });
  }

  if (dailyTarget === 0) {
    document.getElementById("smartAlert").innerText =
      "Complete your profile to calculate your daily calories.";

    document.getElementById("workoutSuggestion").innerHTML =
      "Complete your profile and add meals to get suggestion.";
  } else if (remaining < 0) {
    const extra = Math.abs(remaining);

    document.getElementById("smartAlert").innerText =
      `You have consumed ${extra} kcal more than your recommended limit.`;

    document.getElementById("workoutSuggestion").innerHTML = `
      🔥 You consumed <b>${extra} extra kcal</b><br><br>
      Open workout page to burn your extra calories.<br><br>
      <div class="open-workout-btn">Open Workout Page →</div>
    `;
  } else {
    document.getElementById("smartAlert").innerText =
      `Good job! You still have ${remaining} kcal remaining today.`;

    document.getElementById("workoutSuggestion").innerHTML = `
      ✅ You are within your calorie limit.<br><br>
      Suggested activity:<br>
      🚶 15–20 mins light walk<br>
      🧘 10–15 mins stretching/yoga<br><br>
      <div class="open-workout-btn">Open Workout Page →</div>
    `;
  }
}

function addIndianMeal() {
  if (dailyTarget === 0) {
    alert("Please complete your profile first before adding meals.");
    window.location.href = "profile.html";
    return;
  }

  const rotiQty = Number(document.getElementById("rotiQty").value) || 0;
  const sabjiQty = Number(document.getElementById("sabjiQty").value) || 0;
  const riceQty = Number(document.getElementById("riceQty").value) || 0;
  const dalQty = Number(document.getElementById("dalQty").value) || 0;
  const papadQty = Number(document.getElementById("papadQty").value) || 0;

  const otherFood = document.getElementById("otherFood").value;
  const otherQty = Number(document.getElementById("otherQty").value) || 0;

  if (
    rotiQty < 0 ||
    sabjiQty < 0 ||
    riceQty < 0 ||
    dalQty < 0 ||
    papadQty < 0 ||
    otherQty < 0
  ) {
    alert("Quantity cannot be negative.");
    return;
  }

  let totalCalories = 0;
  let mealDetails = [];

  if (rotiQty > 0) {
    totalCalories += rotiQty * foodCalories.roti;
    mealDetails.push(`${rotiQty} Roti`);
  }

  if (sabjiQty > 0) {
    totalCalories += sabjiQty * foodCalories.sabji;
    mealDetails.push(`${sabjiQty} bowl Sabji`);
  }

  if (riceQty > 0) {
    totalCalories += riceQty * foodCalories.rice;
    mealDetails.push(`${riceQty}g Rice`);
  }

  if (dalQty > 0) {
    totalCalories += dalQty * foodCalories.dal;
    mealDetails.push(`${dalQty} bowl Dal`);
  }

  if (papadQty > 0) {
    totalCalories += papadQty * foodCalories.papad;
    mealDetails.push(`${papadQty} Papad`);
  }

  if (otherFood !== "" && otherQty > 0) {
    totalCalories += otherQty * foodCalories[otherFood];
    mealDetails.push(`${otherQty} ${foodNames[otherFood]}`);
  }

  if (totalCalories <= 0) {
    alert("Please enter at least one food item.");
    return;
  }

  const finalCalories = Math.round(totalCalories);

  const meal = {
    name: mealDetails.join(", "),
    calories: finalCalories,
    date: getTodayKey()
  };

  meals.push(meal);

  consumedCalories += finalCalories;

  saveDailyCalories(finalCalories);

  localStorage.setItem("meals", JSON.stringify(meals));
  localStorage.setItem("consumedCalories", consumedCalories);
  localStorage.setItem("lastSavedDate", todayKey);

  clearMealInputs();
  updateDashboard();
}

function deleteMeal(index) {
  const deletedMealCalories = meals[index].calories;
  const deletedMealDate = meals[index].date || getTodayKey();

  consumedCalories -= deletedMealCalories;

  if (consumedCalories < 0) {
    consumedCalories = 0;
  }

  let calorieHistory =
    JSON.parse(localStorage.getItem("calorieHistory")) || {};

  if (calorieHistory[deletedMealDate]) {
    calorieHistory[deletedMealDate] -= deletedMealCalories;

    if (calorieHistory[deletedMealDate] < 0) {
      calorieHistory[deletedMealDate] = 0;
    }

    localStorage.setItem("calorieHistory", JSON.stringify(calorieHistory));
  }

  meals.splice(index, 1);

  localStorage.setItem("meals", JSON.stringify(meals));
  localStorage.setItem("consumedCalories", consumedCalories);
  localStorage.setItem("lastSavedDate", todayKey);

  updateDashboard();
}

function clearTodayMeals() {
  const confirmClear = confirm("Clear all meals added today?");

  if (!confirmClear) {
    return;
  }

  const currentDate = getTodayKey();

  meals = [];
  consumedCalories = 0;

  let calorieHistory =
    JSON.parse(localStorage.getItem("calorieHistory")) || {};

  calorieHistory[currentDate] = 0;

  localStorage.setItem("meals", JSON.stringify(meals));
  localStorage.setItem("consumedCalories", consumedCalories);
  localStorage.setItem("extraCalories", 0);
  localStorage.setItem("calorieHistory", JSON.stringify(calorieHistory));
  localStorage.setItem("lastSavedDate", currentDate);

  updateDashboard();
}

function resetAllData() {
  const confirmReset = confirm(
    "This will delete your profile, meals, and progress history. Are you sure?"
  );

  if (!confirmReset) {
    return;
  }

  localStorage.removeItem("userProfile");
  localStorage.removeItem("meals");
  localStorage.removeItem("consumedCalories");
  localStorage.removeItem("dailyTarget");
  localStorage.removeItem("extraCalories");
  localStorage.removeItem("calorieHistory");
  localStorage.removeItem("lastSavedDate");

  window.location.href = "profile.html";
}

function clearMealInputs() {
  document.getElementById("rotiQty").value = "";
  document.getElementById("sabjiQty").value = "";
  document.getElementById("riceQty").value = "";
  document.getElementById("dalQty").value = "";
  document.getElementById("papadQty").value = "";
  document.getElementById("otherFood").value = "";
  document.getElementById("otherQty").value = "";
}

function logoutUser() {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    window.location.href = "loginpage.html";
  }
}

updateDashboard();