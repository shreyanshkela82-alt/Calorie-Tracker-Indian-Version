const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email !== "" && password !== "") {
    window.location.href = "dashboard.html";
  } else {
    alert("Please enter email and password");
  }
});