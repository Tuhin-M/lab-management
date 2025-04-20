const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/labs
// @desc    Get all labs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Handle query parameters for filtering
    const { city, rating, search } = req.query;
    
    let query = {};
    
    if (city) {
      query['address.city'] = city;
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const labs = await Lab.find(query).sort({ rating: -1 });
    res.json(labs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/labs/:id
// @desc    Get lab by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id).populate('tests');
    
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    
    res.json(lab);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/labs
// @desc    Create a lab
// @access  Private (Admin)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      name, description, address, contactInfo, certifications,
      operatingHours, tests, image
    } = req.body;

    // Create new lab
    const lab = new Lab({
      name,
      description,
      address,
      contactInfo,
      certifications,
      operatingHours,
      tests,
      image: image || 'default-lab.jpg'
    });

    await lab.save();
    res.json(lab);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/labs/:id
// @desc    Update a lab
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      name, description, address, contactInfo, certifications,
      operatingHours, tests, image, rating
    } = req.body;
    
    // Build lab object
    const labFields = {};
    if (name) labFields.name = name;
    if (description) labFields.description = description;
    if (address) labFields.address = address;
    if (contactInfo) labFields.contactInfo = contactInfo;
    if (certifications) labFields.certifications = certifications;
    if (operatingHours) labFields.operatingHours = operatingHours;
    if (tests) labFields.tests = tests;
    if (image) labFields.image = image;
    if (rating !== undefined) labFields.rating = rating;
    
    let lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    
    lab = await Lab.findByIdAndUpdate(
      req.params.id,
      { $set: labFields },
      { new: true }
    );
    
    res.json(lab);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/labs/:id
// @desc    Delete a lab
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    
    await lab.deleteOne();
    
    res.json({ message: 'Lab removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/labs/:id/reviews
// @desc    Add review to lab
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
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    
    const review = {
      user: req.user.id,
      text,
      rating: parseFloat(rating)
    };
    
    lab.reviews.unshift(review);
    
    // Calculate new average rating
    const totalRating = lab.reviews.reduce((sum, review) => sum + review.rating, 0);
    lab.rating = totalRating / lab.reviews.length;
    
    await lab.save();
    res.json(lab);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lab-owner/labs
// @desc    Get labs owned by current user
// @access  Private (Lab Owner)
router.get('/labs', auth, async (req, res) => {
  try {
    // Check if user is lab owner
    if (req.user.role !== 'lab_owner') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    // Get labs owned by this user
    const labs = await Lab.find({ owner: req.user.id })
      .populate('tests')
      .sort({ createdAt: -1 });
    
    res.json(labs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/lab-owner/labs
// @desc    Create new lab
// @access  Private (Lab Owner)
router.post('/labs', 
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, address, contact } = req.body;
      
      const newLab = new Lab({
        owner: req.user.id,
        name,
        description,
        address,
        contact
      });

      const lab = await newLab.save();
      res.json(lab);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

module.exports = router;
