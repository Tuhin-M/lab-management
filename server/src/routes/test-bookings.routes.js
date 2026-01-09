
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// Helper to map statuses
const mapStatus = (status) => status.toUpperCase();

// @route   GET /api/test-bookings
// @desc    Get all test bookings (admin only)
// @access  Private (Admin)
router.get('/', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    const testBookings = await prisma.testBooking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        lab: { select: { id: true, name: true, address: true } },
        tests: {
          include: {
            test: { select: { id: true, name: true, category: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(testBookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/test-bookings/user
// @desc    Get current user's test bookings
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const testBookings = await prisma.testBooking.findMany({
      where: { userId: req.user.id },
      include: {
        lab: { select: { id: true, name: true, address: true, image: true } },
        tests: {
          include: {
            test: { select: { id: true, name: true, category: true } }
          }
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

// @route   GET /api/test-bookings/:id
// @desc    Get test booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const testBooking = await prisma.testBooking.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        lab: { select: { id: true, name: true, address: true, contactInfo: true } },
        tests: {
          include: {
            test: true
          }
        }
      }
    });

    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }

    // Make sure user owns the test booking or is admin
    if (testBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/test-bookings
// @desc    Create a new test booking
// @access  Private
router.post('/', [
  auth,
  [
    check('lab', 'Lab is required').not().isEmpty(),
    check('tests', 'At least one test is required').isArray({ min: 1 }),
    check('sampleCollectionDate', 'Sample collection date is required').not().isEmpty(),
    check('sampleCollectionTime', 'Sample collection time is required').not().isEmpty(),
    check('patientDetails', 'Patient details are required').not().isEmpty(),
    check('totalAmount', 'Total amount is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      lab, tests, sampleCollectionDate, sampleCollectionTime,
      homeCollection, patientDetails, prescriptionImage, totalAmount
    } = req.body;

    // Check if lab exists
    const labExists = await prisma.lab.findUnique({ where: { id: lab } });
    if (!labExists) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Create new test booking using transaction
    const testBooking = await prisma.testBooking.create({
      data: {
        userId: req.user.id,
        labId: lab,
        bookingDate: new Date(),
        sampleCollectionDate: new Date(sampleCollectionDate),
        sampleCollectionTime,
        homeCollection: homeCollection === true,
        status: 'BOOKED',
        patientDetails: patientDetails || null,
        prescriptionImage: prescriptionImage || null,
        paymentStatus: 'PENDING',
        totalAmount: parseFloat(totalAmount),
        tests: {
          create: tests.map(t => ({
            testId: t.test,
            price: parseFloat(t.price)
          }))
        }
      },
      include: {
        lab: { select: { id: true, name: true, address: true, image: true } },
        tests: {
          include: {
            test: { select: { id: true, name: true, category: true } }
          }
        }
      }
    });

    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/test-bookings/:id
// @desc    Update test booking status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    let testBooking = await prisma.testBooking.findUnique({
      where: { id: req.params.id }
    });

    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }

    // Make sure user owns the test booking or is admin/lab_owner
    if (testBooking.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'LAB_OWNER') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    testBooking = await prisma.testBooking.update({
      where: { id: req.params.id },
      data: {
        status: status ? mapStatus(status) : undefined,
        paymentStatus: paymentStatus ? mapStatus(paymentStatus) : undefined
      },
      include: {
        lab: { select: { id: true, name: true, address: true, image: true } },
        tests: {
          include: {
            test: { select: { id: true, name: true, category: true } }
          }
        }
      }
    });

    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/test-bookings/:id/report
// @desc    Upload test report
// @access  Private (Lab Owner or Admin)
router.put('/:id/report', [auth, roleAuth(['LAB_OWNER', 'ADMIN'])], async (req, res) => {
  try {
    const { url } = req.body;

    const testBooking = await prisma.testBooking.update({
      where: { id: req.params.id },
      data: {
        reportUrl: url,
        reportUploadedAt: new Date(),
        status: 'COMPLETED'
      }
    });

    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/test-bookings/:id
// @desc    Cancel a test booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const testBooking = await prisma.testBooking.findUnique({
      where: { id: req.params.id }
    });

    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }

    // Make sure user owns the test booking
    if (testBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBooking = await prisma.testBooking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Test booking cancelled', booking: updatedBooking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
