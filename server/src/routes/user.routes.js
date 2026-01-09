
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// @route   GET /api/user/appointments
// @desc    Get current user's appointments
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.id },
      include: {
        doctor: { select: { id: true, name: true, specialty: true, hospital: true, image: true } }
      },
      orderBy: { date: 'desc' }
    });

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
    const testBookings = await prisma.testBooking.findMany({
      where: { userId: req.user.id },
      include: {
        lab: { select: { id: true, name: true, address: true, image: true } },
        tests: {
          include: { test: { select: { id: true, name: true, category: true } } }
        }
      },
      orderBy: { bookingDate: 'desc' }
    });

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true
      }
    });

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

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        image: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
