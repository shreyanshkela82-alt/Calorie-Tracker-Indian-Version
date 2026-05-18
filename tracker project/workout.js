const extraCalories = Number(localStorage.getItem("extraCalories")) || 0;

const caloriesToBurn = extraCalories > 0 ? extraCalories : 100;

const workoutPlans = {
  easy: {
    totalMinutes: Math.ceil(caloriesToBurn / 5),
    exercises: [
      { name: "Walking", icon: "🚶", percent: 0.5 },
      { name: "Stretching", icon: "🤸", percent: 0.25 },
      { name: "Light Yoga", icon: "🧘", percent: 0.25 }
    ]
  },

  medium: {
    totalMinutes: Math.ceil(caloriesToBurn / 8),
    exercises: [
      { name: "Jogging", icon: "🏃", percent: 0.45 },
      { name: "Cycling", icon: "🚴", percent: 0.35 },
      { name: "Squats", icon: "💪", percent: 0.2 }
    ]
  },

  hard: {
    totalMinutes: Math.ceil(caloriesToBurn / 12),
    exercises: [
      { name: "Burpees", icon: "🔥", percent: 0.35 },
      { name: "Pushups", icon: "🏋", percent: 0.25 },
      { name: "Mountain Climbers", icon: "⚡", percent: 0.4 }
    ]
  }
};

document.getElementById("easyBurn").innerText = `🔥 ${caloriesToBurn} kcal`;
document.getElementById("mediumBurn").innerText = `🔥 ${caloriesToBurn} kcal`;
document.getElementById("hardBurn").innerText = `🔥 ${caloriesToBurn} kcal`;

document.getElementById("easyTime").innerText = `⏳ ${workoutPlans.easy.totalMinutes} min`;
document.getElementById("mediumTime").innerText = `⏳ ${workoutPlans.medium.totalMinutes} min`;
document.getElementById("hardTime").innerText = `⏳ ${workoutPlans.hard.totalMinutes} min`;

if (extraCalories <= 0) {
  document.getElementById("recommendedTitle").innerText = "You Are On Track";
  document.getElementById("recommendedText").innerText =
    "You are within your calorie target. Light activity is enough.";
} else {
  document.getElementById("recommendedTitle").innerText =
    `Burn ${extraCalories} Extra Calories`;

  document.getElementById("recommendedText").innerText =
    "Choose easy, medium, or hard workout according to your comfort.";
}

function createExercisePlan(level) {
  const plan = workoutPlans[level];

  return plan.exercises.map(function (exercise) {
    return {
      name: exercise.name,
      icon: exercise.icon,
      minutes: Math.max(1, Math.round(plan.totalMinutes * exercise.percent))
    };
  });
}

function updateExerciseList(listId, plan) {
  const list = document.getElementById(listId);
  const spans = list.querySelectorAll("span");

  plan.forEach(function (exercise, index) {
    spans[index].innerText = `${exercise.minutes} min`;
  });
}

const easyPlan = createExercisePlan("easy");
const mediumPlan = createExercisePlan("medium");
const hardPlan = createExercisePlan("hard");

updateExerciseList("easyExerciseList", easyPlan);
updateExerciseList("mediumExerciseList", mediumPlan);
updateExerciseList("hardExerciseList", hardPlan);

let timerInterval;
let remainingSeconds = 0;
let isPaused = false;
let currentPlan = [];
let currentIndex = 0;

const timerDisplay = document.getElementById("timerDisplay");
const timerWorkoutName = document.getElementById("timerWorkoutName");
const nextExerciseText = document.getElementById("nextExerciseText");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function startWorkout(level) {
  clearInterval(timerInterval);

  currentIndex = 0;

  if (level === "easy") currentPlan = easyPlan;
  if (level === "medium") currentPlan = mediumPlan;
  if (level === "hard") currentPlan = hardPlan;

  startExercise();
}

function startExercise() {
  clearInterval(timerInterval);

  if (currentIndex >= currentPlan.length) {
    timerWorkoutName.innerText = "Workout Completed ✅";
    timerDisplay.innerText = "00:00";
    nextExerciseText.innerText = "Great job! You completed all exercises.";
    return;
  }

  const exercise = currentPlan[currentIndex];

  remainingSeconds = exercise.minutes * 60;
  isPaused = false;
  pauseBtn.innerText = "Pause";

  timerWorkoutName.innerText =
    `${exercise.icon} ${exercise.name} - ${exercise.minutes} min`;

  if (currentIndex + 1 < currentPlan.length) {
    const next = currentPlan[currentIndex + 1];
    nextExerciseText.innerText =
      `Next: ${next.icon} ${next.name} for ${next.minutes} min`;
  } else {
    nextExerciseText.innerText = "Last exercise. Finish strong!";
  }

  updateTimerDisplay();

  timerInterval = setInterval(function () {
    if (!isPaused && remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay();
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      currentIndex++;

      if (currentIndex < currentPlan.length) {
        const next = currentPlan[currentIndex];
        timerWorkoutName.innerText = `Get ready for ${next.icon} ${next.name}`;
        nextExerciseText.innerText = "Starting next exercise in 2 seconds...";

        setTimeout(startExercise, 2000);
      } else {
        timerWorkoutName.innerText = "Workout Completed ✅";
        timerDisplay.innerText = "00:00";
        nextExerciseText.innerText = "Great job! You completed all exercises.";
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timerDisplay.innerText =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

document.querySelectorAll(".start-timer-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    startWorkout(button.dataset.level);
  });
});

pauseBtn.addEventListener("click", function () {
  isPaused = !isPaused;
  pauseBtn.innerText = isPaused ? "Resume" : "Pause";
});

resetBtn.addEventListener("click", function () {
  clearInterval(timerInterval);
  remainingSeconds = 0;
  currentIndex = 0;
  currentPlan = [];

  timerWorkoutName.innerText = "Choose a workout to start";
  nextExerciseText.innerText = "Your next exercise will appear here.";
  pauseBtn.innerText = "Pause";

  updateTimerDisplay();
});

updateTimerDisplay();