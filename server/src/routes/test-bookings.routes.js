
const express = require('express');
const router = express.Router();
const TestBooking = require('../models/TestBooking');
const Lab = require('../models/Lab');
const Test = require('../models/Test');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/test-bookings
// @desc    Get all test bookings (admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const testBookings = await TestBooking.find()
      .populate('user', 'name email')
      .populate('lab', 'name address')
      .populate('tests.test', 'name category');
    
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

// @route   GET /api/test-bookings/:id
// @desc    Get test booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const testBooking = await TestBooking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('lab', 'name address contactInfo')
      .populate('tests.test', 'name description category price');
    
    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    
    // Make sure user owns the test booking or is admin
    if (testBooking.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test booking not found' });
    }
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
    const labExists = await Lab.findById(lab);
    if (!labExists) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    
    // Validate all tests exist
    for (const testItem of tests) {
      const testExists = await Test.findById(testItem.test);
      if (!testExists) {
        return res.status(404).json({ message: `Test with ID ${testItem.test} not found` });
      }
    }
    
    // Create new test booking
    const testBooking = new TestBooking({
      user: req.user.id,
      lab,
      tests,
      bookingDate: new Date(),
      sampleCollectionDate,
      sampleCollectionTime,
      homeCollection,
      status: 'booked',
      patientDetails,
      prescriptionImage,
      paymentStatus: 'pending',
      totalAmount
    });

    await testBooking.save();
    
    const populatedTestBooking = await TestBooking.findById(testBooking._id)
      .populate('lab', 'name address image')
      .populate('tests.test', 'name category');
    
    res.json(populatedTestBooking);
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
    
    let testBooking = await TestBooking.findById(req.params.id);
    
    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    
    // Make sure user owns the test booking or is admin
    if (testBooking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build test booking object
    const testBookingFields = {};
    if (status) testBookingFields.status = status;
    if (paymentStatus) testBookingFields.paymentStatus = paymentStatus;
    
    testBooking = await TestBooking.findByIdAndUpdate(
      req.params.id,
      { $set: testBookingFields },
      { new: true }
    ).populate('lab', 'name address image')
      .populate('tests.test', 'name category');
    
    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/test-bookings/:id/report
// @desc    Upload test report
// @access  Private (Admin)
router.put('/:id/report', auth, async (req, res) => {
  try {
    const { url } = req.body;
    
    let testBooking = await TestBooking.findById(req.params.id);
    
    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    
    testBooking.report = {
      url,
      uploadedAt: Date.now()
    };
    
    testBooking.status = 'completed';
    
    await testBooking.save();
    
    res.json(testBooking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/test-bookings/:id
// @desc    Cancel a test booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const testBooking = await TestBooking.findById(req.params.id);
    
    if (!testBooking) {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    
    // Make sure user owns the test booking
    if (testBooking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Instead of deleting, set status to cancelled
    testBooking.status = 'cancelled';
    await testBooking.save();
    
    res.json({ message: 'Test booking cancelled' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test booking not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
