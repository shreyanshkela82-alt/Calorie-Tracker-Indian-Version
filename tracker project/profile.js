const profileForm = document.getElementById("profileForm");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const activityInput = document.getElementById("activity");
const goalInput = document.getElementById("goal");

const previewBmi = document.getElementById("previewBmi");
const previewCalories = document.getElementById("previewCalories");

/* LOAD OLD PROFILE DATA */

const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

if (savedProfile) {
  nameInput.value = savedProfile.name || "";
  ageInput.value = savedProfile.age || "";
  genderInput.value = savedProfile.gender || "male";
  weightInput.value = savedProfile.weight || "";
  heightInput.value = savedProfile.height || "";
  activityInput.value = savedProfile.activity || "1.2";
  goalInput.value = savedProfile.goal || "lose";

  updatePreview();
}

/* CALCULATE PROFILE DATA */

function calculateProfileData() {
  const age = Number(ageInput.value);
  const gender = genderInput.value;
  const weight = Number(weightInput.value);
  const height = Number(heightInput.value);
  const activity = Number(activityInput.value);
  const goal = goalInput.value;

  if (!age || !weight || !height || !activity || !goal) {
    return null;
  }

  const heightInMeter = height / 100;
  const bmi = weight / (heightInMeter * heightInMeter);

  let bmiStatus = "";

  if (bmi < 18.5) {
    bmiStatus = "Underweight";
  } else if (bmi < 25) {
    bmiStatus = "Normal";
  } else if (bmi < 30) {
    bmiStatus = "Overweight";
  } else {
    bmiStatus = "Obese";
  }

  let bmr;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const maintenanceCalories = Math.round(bmr * activity);

  let dailyCalories = maintenanceCalories;

  if (goal === "lose") {
    dailyCalories = maintenanceCalories - 500;
  } else if (goal === "maintain") {
    dailyCalories = maintenanceCalories;
  }

  if (dailyCalories < 1200) {
    dailyCalories = 1200;
  }

  return {
    age: age,
    gender: gender,
    weight: weight,
    height: height,
    activity: activityInput.value,
    goal: goal,
    bmi: bmi.toFixed(1),
    bmiStatus: bmiStatus,
    maintenanceCalories: maintenanceCalories,
    dailyCalories: Math.round(dailyCalories)
  };
}

/* PREVIEW UPDATE */

function updatePreview() {
  const result = calculateProfileData();

  if (!result) {
    previewBmi.innerText = "--";
    previewCalories.innerText = "-- kcal";
    return;
  }

  previewBmi.innerText = result.bmi;
  previewCalories.innerText = `${result.dailyCalories} kcal`;
}

[
  ageInput,
  genderInput,
  weightInput,
  heightInput,
  activityInput,
  goalInput
].forEach(function (input) {
  input.addEventListener("input", updatePreview);
});

/* SAVE PROFILE */

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const result = calculateProfileData();

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  if (!result) {
    alert("Please fill all profile details correctly.");
    return;
  }

  const userProfile = {
    name: name,
    age: result.age,
    gender: result.gender,
    weight: result.weight,
    height: result.height,
    activity: result.activity,
    goal: result.goal,
    bmi: result.bmi,
    bmiStatus: result.bmiStatus,
    maintenanceCalories: result.maintenanceCalories,
    dailyCalories: result.dailyCalories
  };

  localStorage.setItem("userProfile", JSON.stringify(userProfile));
  localStorage.setItem("dailyTarget", result.dailyCalories);

  updateSideProfileSummary();

  window.location.href = "dashboard.html";
});

/* SIDE PROFILE SUMMARY */

function updateSideProfileSummary() {
  const profile = JSON.parse(localStorage.getItem("userProfile"));

  if (!profile) {
    return;
  }

  const heightInMeter = Number(profile.height) / 100;
  const weight = Number(profile.weight);

  if (heightInMeter > 0 && weight > 0) {
    const bmi = weight / (heightInMeter * heightInMeter);
    document.getElementById("sideBmi").innerText = bmi.toFixed(1);
  }

  document.getElementById("sideCalories").innerText =
    `${profile.dailyCalories || "--"} kcal`;

  document.getElementById("sideGoal").innerText =
    profile.goal === "lose" ? "Weight Loss" : "Maintain";

  const activityText = {
    "1.2": "Low",
    "1.375": "Light",
    "1.55": "Moderate",
    "1.725": "Very Active"
  };

  document.getElementById("sideActivity").innerText =
    activityText[profile.activity] || "--";
}

updateSideProfileSummary();
updatePreview();