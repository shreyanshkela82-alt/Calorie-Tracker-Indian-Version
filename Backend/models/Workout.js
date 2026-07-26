const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    workoutName: {
        type: String,
        required: true
    },

    caloriesBurned: {
        type: Number,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    date: {
        type: String,
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Workout", workoutSchema);