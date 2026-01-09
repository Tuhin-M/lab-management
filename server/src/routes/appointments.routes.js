
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// Helper to map statuses
const mapStatus = (status) => status.toUpperCase();

// @route   GET /api/appointments
// @desc    Get all appointments (admin only)
// @access  Private (Admin)
router.get('/', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true, hospital: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

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

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        doctor: { select: { id: true, name: true, specialty: true, hospital: true, address: true, consultationFee: true, image: true } }
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Make sure user owns the appointment or is admin
    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
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
    const doctorExists = await prisma.doctor.findUnique({ where: { id: doctor } });
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create new appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.id,
        doctorId: doctor,
        date: new Date(date),
        timeSlot,
        reasonForVisit,
        notes: notes || null,
        paymentStatus: 'PENDING',
        paymentAmount: parseFloat(paymentAmount),
        status: 'BOOKED'
      },
      include: {
        doctor: { select: { id: true, name: true, specialty: true, hospital: true, image: true } }
      }
    });

    res.json(appointment);
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

    let appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Make sure user owns the appointment or is admin/doctor
    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'DOCTOR') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        status: status ? mapStatus(status) : undefined,
        notes: notes || undefined,
        paymentStatus: paymentStatus ? mapStatus(paymentStatus) : undefined
      },
      include: {
        doctor: { select: { id: true, name: true, specialty: true, hospital: true, image: true } }
      }
    });

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Make sure user owns the appointment
    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'DOCTOR') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Appointment cancelled', appointment: updatedAppointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
