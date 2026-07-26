const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        default: null
    },

    gender: {
        type: String,
        default: "male"
    },

    height: {
        type: Number,
        default: null
    },

    weight: {
        type: Number,
        default: null
    },

    activity: {
        type: String,
        default: "1.2"
    },

    goal: {
        type: String,
        default: ""
    },

    dailyCalories: {
    type: Number,
    default: 2000
},

bmi: {
    type: Number,
    default: 0
},

bmiStatus: {
    type: String,
    default: "Pending"
}


},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);