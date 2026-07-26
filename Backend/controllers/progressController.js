const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { syncDailyProgress } = require("../utils/progressSync");

// Save or Update Today's Progress (manually triggered, e.g. a "refresh" button)
const saveProgress = asyncHandler(async (req, res) => {
    const today = new Date().toISOString().split("T")[0];

    const progress = await syncDailyProgress(req.user._id, today);

    res.status(200).json({
        success: true,
        progress
    });
});

// Get All Progress (optionally filtered by ?from=YYYY-MM-DD&to=YYYY-MM-DD)
const getProgress = asyncHandler(async (req, res) => {
    const filter = { user: req.user._id };

    if (req.query.from || req.query.to) {
        filter.date = {};
        if (req.query.from) filter.date.$gte = req.query.from;
        if (req.query.to) filter.date.$lte = req.query.to;
    }

    const progress = await Progress.find(filter).sort({ date: 1 });

    res.status(200).json({
        success: true,
        progress
    });
});

// Delete Progress
const deleteProgress = asyncHandler(async (req, res) => {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
        throw new ApiError(404, "Progress not found");
    }

    if (progress.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this record");
    }

    await progress.deleteOne();

    res.status(200).json({
        success: true,
        message: "Progress deleted successfully"
    });
});

module.exports = {
    saveProgress,
    getProgress,
    deleteProgress
};
