require("dotenv").config();
const express = require("express");
// Import centralized CORS and error handler middleware
const corsOptions = require("./middleware/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const doctorsRoutes = require("./routes/doctors.routes");
const labsRoutes = require("./routes/labs.routes");
const appointmentsRoutes = require("./routes/appointments.routes");
const testBookingsRoutes = require("./routes/test-bookings.routes");
const blogRoutes = require("./routes/blog.routes");
const userRoutes = require("./routes/user.routes");
const categoriesRoutes = require("./routes/categories.routes");
const specialtiesRoutes = require("./routes/specialties.routes");
const testsRoutes = require("./routes/tests.routes");
const healthRecordsRoutes = require("./routes/health-records.routes");
const labOwnerRoutes = require('./routes/lab-owner.routes');

// Initialize express app
const app = express();

// Connect to PostgreSQL via Prisma
connectDB();

// Middleware
// Use CORS middleware for frontend
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/labs", labsRoutes);
app.use("/api/lab-owner", labOwnerRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/test-bookings", testBookingsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/specialties", specialtiesRoutes);
app.use("/api/tests", testsRoutes);
app.use("/api/health-records", healthRecordsRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Healthcare App API" });
});

// Health check endpoint for deployment readiness
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
