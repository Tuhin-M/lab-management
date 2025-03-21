
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const labsRoutes = require('./routes/labs.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const testBookingsRoutes = require('./routes/test-bookings.routes');
const blogRoutes = require('./routes/blog.routes');
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const specialtiesRoutes = require('./routes/specialties.routes');
const testsRoutes = require('./routes/tests.routes');
const healthRecordsRoutes = require('./routes/health-records.routes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/test-bookings', testBookingsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/specialties', specialtiesRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/health-records', healthRecordsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Healthcare App API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
