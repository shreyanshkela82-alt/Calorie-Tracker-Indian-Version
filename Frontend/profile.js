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



/* AUTH CHECK */

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "index.html";
}

fetch("https://indian-calorie-tracker-api.onrender.com/api/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {

  if (!data.success) return;

  const profile = data.user;

  nameInput.value = profile.name || "";
  ageInput.value = profile.age || "";
  genderInput.value = profile.gender || "male";
  weightInput.value = profile.weight || "";
  heightInput.value = profile.height || "";
  activityInput.value = profile.activity || "1.2";
  goalInput.value = profile.goal || "lose";

  updatePreview();
  updateSideProfileSummary(profile);

})
.catch(err => console.log(err));

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

  const token = localStorage.getItem("token");

fetch("https://indian-calorie-tracker-api.onrender.com/api/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
 body: JSON.stringify({
    age: result.age,
    gender: result.gender,
    height: result.height,
    weight: result.weight,
    activity: result.activity,
    goal: result.goal,
    dailyCalories: result.dailyCalories
})
})
.then(res => res.json())
.then(data => {

  if (data.success) {

    localStorage.setItem("userProfile", JSON.stringify(data.user));

updateSideProfileSummary(data.user);

window.location.href = "dashboard.html";

  } else {
    alert(data.message);
  }

})
.catch(err => {
  console.log(err);
  alert("Server Error");
});
});

/* SIDE PROFILE SUMMARY */

function updateSideProfileSummary(profile) {

  if (!profile) return;

  const heightInMeter = Number(profile.height) / 100;
  const weight = Number(profile.weight);

  if (heightInMeter > 0 && weight > 0) {
    const bmi = weight / (heightInMeter * heightInMeter);
    document.getElementById("sideBmi").innerText = bmi.toFixed(1);
  }

  document.getElementById("sideCalories").innerText =
    `${profile.dailyCalories || "--"} kcal`;

  document.getElementById("sideGoal").innerText =
    profile.goal === "lose"
      ? "Weight Loss"
      : "Maintain";

  const activityText = {
    "1.2": "Low",
    "1.375": "Light",
    "1.55": "Moderate",
    "1.725": "Very Active"
  };

  document.getElementById("sideActivity").innerText =
    activityText[profile.activity] || "--";
}

updatePreview();