
const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/specialties
// @desc    Get all specialties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/specialties/:id
// @desc    Get specialty by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/specialties
// @desc    Create a specialty
// @access  Private (Admin)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, icon } = req.body;

    // Create new specialty
    const specialty = new Specialty({
      name,
      description,
      icon: icon || 'default-specialty.png'
    });

    await specialty.save();
    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Specialty with this name already exists' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/specialties/:id
// @desc    Update a specialty
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    // Build specialty object
    const specialtyFields = {};
    if (name) specialtyFields.name = name;
    if (description) specialtyFields.description = description;
    if (icon) specialtyFields.icon = icon;
    
    let specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      { $set: specialtyFields },
      { new: true }
    );
    
    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Specialty with this name already exists' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/specialties/:id
// @desc    Delete a specialty
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    await specialty.deleteOne();
    
    res.json({ message: 'Specialty removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
