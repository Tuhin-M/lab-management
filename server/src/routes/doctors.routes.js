
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Handle query parameters for filtering
    const { specialty, experience, rating, city, search } = req.query;
    
    let query = {};
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    if (city) {
      query['address.city'] = city;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } }
      ];
    }
    
    const doctors = await Doctor.find(query).sort({ rating: -1 });
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/doctors
// @desc    Create a doctor
// @access  Private (Admin)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('specialty', 'Specialty is required').not().isEmpty(),
    check('experience', 'Experience is required and must be a number').isNumeric(),
    check('hospital', 'Hospital/Clinic name is required').not().isEmpty(),
    check('consultationFee', 'Consultation fee is required and must be a number').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      name, specialty, qualifications, experience, hospital,
      address, consultationFee, availableSlots, image 
    } = req.body;

    // Create new doctor
    const doctor = new Doctor({
      name,
      specialty,
      qualifications,
      experience,
      hospital,
      address,
      consultationFee,
      availableSlots,
      image: image || 'default-doctor.jpg'
    });

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update a doctor
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      name, specialty, qualifications, experience, hospital,
      address, consultationFee, availableSlots, image, rating
    } = req.body;
    
    // Build doctor object
    const doctorFields = {};
    if (name) doctorFields.name = name;
    if (specialty) doctorFields.specialty = specialty;
    if (qualifications) doctorFields.qualifications = qualifications;
    if (experience) doctorFields.experience = experience;
    if (hospital) doctorFields.hospital = hospital;
    if (address) doctorFields.address = address;
    if (consultationFee) doctorFields.consultationFee = consultationFee;
    if (availableSlots) doctorFields.availableSlots = availableSlots;
    if (image) doctorFields.image = image;
    if (rating !== undefined) doctorFields.rating = rating;
    
    let doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: doctorFields },
      { new: true }
    );
    
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    await doctor.deleteOne();
    
    res.json({ message: 'Doctor removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/doctors/:id/reviews
// @desc    Add review to doctor
// @access  Private
router.post('/:id/reviews', [
  auth,
  [
    check('text', 'Text is required').not().isEmpty(),
    check('rating', 'Rating is required and must be between 0 and 5').isFloat({ min: 0, max: 5 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { text, rating } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const review = {
      user: req.user.id,
      text,
      rating: parseFloat(rating)
    };
    
    doctor.reviews.unshift(review);
    
    // Calculate new average rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.rating = totalRating / doctor.reviews.length;
    
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET /api/doctors/available-slots/:id
// @desc    Get doctor's available slots
// @access  Public
router.get('/available-slots/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availableSlots');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor.availableSlots);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
