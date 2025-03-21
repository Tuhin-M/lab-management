
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const TestBooking = require('../models/TestBooking');
const auth = require('../middleware/auth');

// @route   GET /api/user/appointments
// @desc    Get current user's appointments
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name specialty hospital image')
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/user/test-bookings
// @desc    Get current user's test bookings
// @access  Private
router.get('/test-bookings', auth, async (req, res) => {
  try {
    const testBookings = await TestBooking.find({ user: req.user.id })
      .populate('lab', 'name address image')
      .populate('tests.test', 'name category')
      .sort({ bookingDate: -1 });
    
    res.json(testBookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Build user profile object
    const userFields = {};
    if (name) userFields.name = name;
    if (phone) userFields.phone = phone;
    if (address) userFields.address = address;
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
