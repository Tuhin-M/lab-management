
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private (Admin)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name cannot exceed 50 characters').isLength({ max: 50 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, parentCategory } = req.body;

    // Create new category
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    
    // Build category object
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;
    if (parentCategory) categoryFields.parentCategory = parentCategory;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.deleteOne();
    
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
