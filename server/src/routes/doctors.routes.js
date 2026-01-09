
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialty, experience, rating, city, search } = req.query;

    let whereClause = {};

    if (specialty) {
      whereClause.specialty = {
        name: specialty
      };
    }

    if (experience) {
      whereClause.experience = { gte: parseInt(experience) };
    }

    if (rating) {
      whereClause.rating = { gte: parseFloat(rating) };
    }

    if (city) {
      whereClause.address = {
        path: ['city'],
        equals: city
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { hospital: { contains: search, mode: 'insensitive' } }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' },
      include: {
        specialty: true
      }
    });

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
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        specialty: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/doctors
// @desc    Create a doctor
// @access  Private (Admin)
router.post('/', [
  auth,
  roleAuth(['ADMIN']),
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

    // Find specialty or error
    const specialtyEntity = await prisma.specialty.findUnique({
      where: { name: specialty }
    });

    if (!specialtyEntity) {
      return res.status(400).json({ message: 'Invalid specialty' });
    }

    // Create new doctor
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialtyId: specialtyEntity.id,
        qualifications: qualifications || [],
        experience: parseInt(experience),
        hospital,
        address: address || null,
        consultationFee: parseFloat(consultationFee),
        availableSlots: availableSlots || null,
        image: image || 'default-doctor.jpg'
      }
    });

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update a doctor
// @access  Private (Admin)
router.put('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    const {
      name, specialty, qualifications, experience, hospital,
      address, consultationFee, availableSlots, image, rating
    } = req.body;

    let specialtyId = undefined;
    if (specialty) {
      const specialtyEntity = await prisma.specialty.findUnique({
        where: { name: specialty }
      });
      if (specialtyEntity) {
        specialtyId = specialtyEntity.id;
      }
    }

    const doctor = await prisma.doctor.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        specialtyId: specialtyId || undefined,
        qualifications: qualifications || undefined,
        experience: experience ? parseInt(experience) : undefined,
        hospital: hospital || undefined,
        address: address || undefined,
        consultationFee: consultationFee ? parseFloat(consultationFee) : undefined,
        availableSlots: availableSlots || undefined,
        image: image || undefined,
        rating: rating !== undefined ? parseFloat(rating) : undefined
      }
    });

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private (Admin)
router.delete('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    await prisma.doctor.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Doctor removed' });
  } catch (err) {
    console.error(err.message);
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
    const doctorId = req.params.id;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { reviews: true }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        doctorId: doctorId,
        text,
        rating: parseInt(rating)
      }
    });

    // Recalculate average rating
    const allReviews = await prisma.review.findMany({
      where: { doctorId }
    });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    await prisma.doctor.update({
      where: { id: doctorId },
      data: { rating: avgRating }
    });

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/doctors/available-slots/:id
// @desc    Get doctor's available slots
// @access  Public
router.get('/available-slots/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      select: { availableSlots: true }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor.availableSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
