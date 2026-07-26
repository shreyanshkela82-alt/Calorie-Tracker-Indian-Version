const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    caloriesConsumed: {
        type: Number,
        default: 0
    },

    caloriesBurned: {
        type: Number,
        default: 0
    },

    targetCalories: {
        type: Number,
        default: 2000
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Progress", progressSchema);