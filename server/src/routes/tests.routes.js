
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/tests
// @desc    Get all tests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, homeCollection, search } = req.query;

    let whereClause = {};

    if (category) {
      whereClause.category = {
        name: category
      };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    if (homeCollection) {
      whereClause.homeCollection = homeCollection === 'true';
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const tests = await prisma.test.findMany({
      where: whereClause,
      orderBy: { popularity: 'desc' },
      include: {
        category: true
      }
    });

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
    const test = await prisma.test.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        labs: {
          select: {
            id: true,
            name: true,
            address: true,
            rating: true
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/tests
// @desc    Create a test
// @access  Private (Admin)
router.post('/', [
  auth,
  roleAuth(['ADMIN']),
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

    // Find or create category
    let categoryEntity = await prisma.category.findUnique({
      where: { name: category }
    });

    if (!categoryEntity) {
      categoryEntity = await prisma.category.create({
        data: { name: category, description: `${category} tests` }
      });
    }

    // Create new test
    const test = await prisma.test.create({
      data: {
        name,
        description,
        categoryId: categoryEntity.id,
        price: parseFloat(price),
        preparationNeeded,
        timeRequired,
        reportTime,
        homeCollection: homeCollection === true,
        homeCollectionFee: homeCollectionFee ? parseFloat(homeCollectionFee) : 0,
        labs: labs ? {
          connect: labs.map(id => ({ id }))
        } : undefined
      }
    });

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Private (Admin)
router.put('/:id', auth, roleAuth(['ADMIN']), async (req, res) => {
  try {
    const {
      name, description, category, price, preparationNeeded,
      timeRequired, reportTime, homeCollection, homeCollectionFee,
      labs, popularity
    } = req.body;

    let categoryId = undefined;
    if (category) {
      let categoryEntity = await prisma.category.findUnique({
        where: { name: category }
      });
      if (!categoryEntity) {
        categoryEntity = await prisma.category.create({
          data: { name: category, description: `${category} tests` }
        });
      }
      categoryId = categoryEntity.id;
    }

    const test = await prisma.test.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        categoryId: categoryId || undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        preparationNeeded: preparationNeeded || undefined,
        timeRequired: timeRequired || undefined,
        reportTime: reportTime || undefined,
        homeCollection: homeCollection !== undefined ? homeCollection : undefined,
        homeCollectionFee: homeCollectionFee !== undefined ? parseFloat(homeCollectionFee) : undefined,
        popularity: popularity !== undefined ? parseInt(popularity) : undefined,
        labs: labs ? {
          set: labs.map(id => ({ id }))
        } : undefined
      }
    });

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tests/:id
// @desc    Delete a test
// @access  Private (Admin)
router.delete('/:id', auth, roleAuth(['ADMIN']), async (req, res) => {
  try {
    await prisma.test.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
