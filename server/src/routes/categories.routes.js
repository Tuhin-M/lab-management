
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        parentCategory: { select: { id: true, name: true } },
        subCategories: { select: { id: true, name: true } }
      }
    });
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
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        parentCategory: { select: { id: true, name: true } },
        subCategories: { select: { id: true, name: true } }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private (Admin)
router.post('/', [
  auth,
  roleAuth(['ADMIN']),
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

    // Check if name exists
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentCategoryId: parentCategory || null
      }
    });

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin)
router.put('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        parentCategoryId: parentCategory || undefined
      }
    });

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin)
router.delete('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

module.exports = router;
