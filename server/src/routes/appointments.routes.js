
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/appointments
// @desc    Get all appointments (admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialty hospital');
    
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/appointments/user
// @desc    Get current user's appointments
// @access  Private
router.get('/user', auth, async (req, res) => {
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

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('doctor', 'name specialty hospital address consultationFee image');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Make sure user owns the appointment or is admin
    if (appointment.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', [
  auth,
  [
    check('doctor', 'Doctor is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('timeSlot', 'Time slot is required').not().isEmpty(),
    check('reasonForVisit', 'Reason for visit is required').not().isEmpty(),
    check('paymentAmount', 'Payment amount is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { doctor, date, timeSlot, reasonForVisit, notes, paymentAmount } = req.body;
    
    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Create new appointment
    const appointment = new Appointment({
      user: req.user.id,
      doctor,
      date,
      timeSlot,
      reasonForVisit,
      notes,
      paymentStatus: 'pending',
      paymentAmount
    });

    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialty hospital image');
    
    res.json(populatedAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes, paymentStatus } = req.body;
    
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Make sure user owns the appointment or is admin
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build appointment object
    const appointmentFields = {};
    if (status) appointmentFields.status = status;
    if (notes) appointmentFields.notes = notes;
    if (paymentStatus) appointmentFields.paymentStatus = paymentStatus;
    
    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: appointmentFields },
      { new: true }
    ).populate('doctor', 'name specialty hospital image');
    
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Make sure user owns the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Instead of deleting, set status to cancelled
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
