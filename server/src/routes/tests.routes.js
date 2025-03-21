
const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/tests
// @desc    Get all tests
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Handle query parameters for filtering
    const { category, minPrice, maxPrice, homeCollection, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    }
    
    if (homeCollection) {
      query.homeCollection = homeCollection === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tests = await Test.find(query).sort({ popularity: -1 });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tests/:id
// @desc    Get test by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('labs', 'name address rating');
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/tests
// @desc    Create a test
// @access  Private (Admin)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price is required and must be a number').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      name, description, category, price, preparationNeeded, 
      timeRequired, reportTime, homeCollection, homeCollectionFee,
      labs
    } = req.body;

    // Create new test
    const test = new Test({
      name,
      description,
      category,
      price,
      preparationNeeded,
      timeRequired,
      reportTime,
      homeCollection,
      homeCollectionFee,
      labs
    });

    await test.save();
    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      name, description, category, price, preparationNeeded, 
      timeRequired, reportTime, homeCollection, homeCollectionFee,
      labs, popularity
    } = req.body;
    
    // Build test object
    const testFields = {};
    if (name) testFields.name = name;
    if (description) testFields.description = description;
    if (category) testFields.category = category;
    if (price !== undefined) testFields.price = price;
    if (preparationNeeded) testFields.preparationNeeded = preparationNeeded;
    if (timeRequired) testFields.timeRequired = timeRequired;
    if (reportTime) testFields.reportTime = reportTime;
    if (homeCollection !== undefined) testFields.homeCollection = homeCollection;
    if (homeCollectionFee !== undefined) testFields.homeCollectionFee = homeCollectionFee;
    if (labs) testFields.labs = labs;
    if (popularity !== undefined) testFields.popularity = popularity;
    
    let test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    test = await Test.findByIdAndUpdate(
      req.params.id,
      { $set: testFields },
      { new: true }
    );
    
    res.json(test);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tests/:id
// @desc    Delete a test
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    await test.deleteOne();
    
    res.json({ message: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
