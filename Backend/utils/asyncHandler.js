// Wraps async route handlers so errors are automatically passed to
// the centralized error middleware instead of needing try/catch everywhere.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
