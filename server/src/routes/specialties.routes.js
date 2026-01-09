
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/specialties
// @desc    Get all specialties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: 'asc' }
    });
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
    const specialty = await prisma.specialty.findUnique({
      where: { id: req.params.id }
    });

    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/specialties
// @desc    Create a specialty
// @access  Private (Admin)
router.post('/', [
  auth,
  roleAuth(['ADMIN']),
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

    // Check if name exists
    const existing = await prisma.specialty.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Specialty with this name already exists' });
    }

    // Create new specialty
    const specialty = await prisma.specialty.create({
      data: {
        name,
        description,
        icon: icon || 'default-specialty.png'
      }
    });

    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/specialties/:id
// @desc    Update a specialty
// @access  Private (Admin)
router.put('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const specialty = await prisma.specialty.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        icon: icon || undefined
      }
    });

    res.json(specialty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/specialties/:id
// @desc    Delete a specialty
// @access  Private (Admin)
router.delete('/:id', [auth, roleAuth(['ADMIN'])], async (req, res) => {
  try {
    await prisma.specialty.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Specialty removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

module.exports = router;
