// Centralized error handling middleware for Express
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred."
  });
};
