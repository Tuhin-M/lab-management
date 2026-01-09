const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/lab-owner/labs
// @desc    Get labs owned by current user
// @access  Private (Lab Owner)
router.get('/labs', [auth, roleAuth(['LAB_OWNER'])], async (req, res) => {
  try {
    const labs = await prisma.lab.findMany({
      where: {
        owners: { some: { id: req.user.id } }
      },
      include: { tests: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(labs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lab-owner/stats
// @desc    Get summary stats for lab owner dashboard
// @access  Private (Lab Owner)
router.get('/stats', [auth, roleAuth(['LAB_OWNER'])], async (req, res) => {
  try {
    // Basic stats aggregation
    const labs = await prisma.lab.findMany({
      where: { owners: { some: { id: req.user.id } } },
      select: { id: true }
    });
    const labIds = labs.map(l => l.id);

    const bookingCount = await prisma.testBooking.count({
      where: { labId: { in: labIds } }
    });

    const pendingBookings = await prisma.testBooking.count({
      where: {
        labId: { in: labIds },
        status: 'BOOKED'
      }
    });

    // Returning dummy analytic stats for demo, combined with some real counts
    return res.json({
      totalLabs: labs.length,
      totalAppointments: bookingCount,
      totalTests: 0, // Need deeper aggregation for this
      totalRevenue: 0,
      pendingAppointments: pendingBookings,
      recentAppointments: [], // Can populate from testBooking
      analytics: []
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
