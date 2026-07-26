// Custom error class so controllers can throw errors with a specific
// HTTP status code, and the centralized error handler knows how to respond.
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
    }
}

module.exports = ApiError;
