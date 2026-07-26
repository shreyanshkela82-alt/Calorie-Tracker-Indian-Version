const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // sets sensible security-related HTTP headers
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev")); // request logging in development
}

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to Calorie Tracker Backend 🚀");
});

// Health check - useful for uptime monitors / deployment platforms
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, status: "ok" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
