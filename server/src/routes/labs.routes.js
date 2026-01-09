const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/labs
// @desc    Get all labs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, rating, search } = req.query;

    let whereClause = {};

    if (city) {
      // Filtering JSON field in PostgreSQL
      whereClause.address = {
        path: ['city'],
        equals: city
      };
    }

    if (rating) {
      whereClause.rating = { gte: parseFloat(rating) };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const labs = await prisma.lab.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' },
      include: {
        tests: true
      }
    });

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
    const lab = await prisma.lab.findUnique({
      where: { id: req.params.id },
      include: {
        tests: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.json(lab);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/labs
// @desc    Create a lab
// @access  Private (Admin)
router.post('/', [
  auth,
  roleAuth(['ADMIN']),
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

    // Create new lab with potential test connections
    const lab = await prisma.lab.create({
      data: {
        name,
        description,
        address: address || null,
        contactInfo: contactInfo || null,
        certifications: certifications || [],
        operatingHours: operatingHours || null,
        image: image || 'default-lab.jpg',
        tests: tests ? {
          connect: tests.map(id => ({ id }))
        } : undefined
      },
      include: {
        tests: true
      }
    });

    res.json(lab);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/labs/:id
// @desc    Update a lab
// @access  Private (Admin or Lab Owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name, description, address, contactInfo, certifications,
      operatingHours, tests, image, rating
    } = req.body;

    // Check if lab exists
    let lab = await prisma.lab.findUnique({
      where: { id: req.params.id },
      include: { owners: true }
    });

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Authorization check
    const isOwner = lab.owners.some(owner => owner.id === req.user.id);
    if (req.user.role !== 'ADMIN' && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this lab' });
    }

    lab = await prisma.lab.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        address: address || undefined,
        contactInfo: contactInfo || undefined,
        certifications: certifications || undefined,
        operatingHours: operatingHours || undefined,
        image: image || undefined,
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        tests: tests ? {
          set: tests.map(id => ({ id }))
        } : undefined
      },
      include: {
        tests: true
      }
    });

    res.json(lab);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/labs/:id
// @desc    Delete a lab
// @access  Private (Admin)
router.delete('/:id', auth, roleAuth(['ADMIN']), async (req, res) => {
  try {
    const lab = await prisma.lab.findUnique({
      where: { id: req.params.id }
    });

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    await prisma.lab.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Lab removed' });
  } catch (err) {
    console.error(err.message);
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
    const labId = req.params.id;

    // Check if lab exists
    const lab = await prisma.lab.findUnique({
      where: { id: labId },
      include: { reviews: true }
    });

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        labId: labId,
        text,
        rating: parseInt(rating)
      }
    });

    // Recalculate average rating
    const allReviews = await prisma.review.findMany({
      where: { labId }
    });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    await prisma.lab.update({
      where: { id: labId },
      data: { rating: avgRating }
    });

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lab-owner/labs
// @desc    Get labs owned by current user
// @access  Private (Lab Owner)
router.get('/my-labs', auth, roleAuth(['LAB_OWNER']), async (req, res) => {
  try {
    const labs = await prisma.lab.findMany({
      where: {
        owners: {
          some: { id: req.user.id }
        }
      },
      include: {
        tests: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(labs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/lab-owner/labs
// @desc    Create new lab for owner
// @access  Private (Lab Owner)
router.post('/my-labs',
  [
    auth,
    roleAuth(['LAB_OWNER']),
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
      const { name, description, address, contactInfo } = req.body;

      const lab = await prisma.lab.create({
        data: {
          name,
          description,
          address,
          contactInfo,
          owners: {
            connect: { id: req.user.id }
          }
        }
      });

      res.json(lab);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
