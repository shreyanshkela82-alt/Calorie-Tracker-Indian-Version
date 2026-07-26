// 404 handler - catches requests to routes that don't exist
const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Centralized error handler - every error in the app (thrown, passed to
// next(), or async errors caught by asyncHandler) ends up here so error
// responses are consistent across the whole API.
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode;
    if (!statusCode || statusCode === 200) statusCode = 500;

    let message = err.message || "Something went wrong on the server";

    // Mongoose bad ObjectId (e.g. /api/meals/invalid-id)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}`;
    }

    // Mongoose duplicate key (e.g. registering with an email already in use)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"} already in use`;
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    console.error(`❌ [${req.method} ${req.originalUrl}]`, err.message);

    res.status(statusCode).json({
        success: false,
        message,
        // Stack trace only in development, never leak it in production
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
};

module.exports = { notFound, errorHandler };
