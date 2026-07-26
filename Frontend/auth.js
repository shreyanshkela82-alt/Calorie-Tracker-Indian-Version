// Check if user is logged in
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first!");
    window.location.href = "loginpage.html";
}

// Logout Function
function logoutUser() {

    // Remove saved data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    // Redirect to login page
    window.location.href = "loginpage.html";
}