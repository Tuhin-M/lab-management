const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/lab-owner/labs
// @desc    Get labs owned by current user
// @access  Private (Lab Owner)
router.get('/labs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'lab_owner') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const labs = await Lab.find({ owner: req.user.id })
      .populate('tests')
      .sort({ createdAt: -1 });
    
    res.json(labs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lab-owner/stats
// @desc    Get summary stats for lab owner dashboard
// @access  Private (Lab Owner)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'lab_owner') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    // Returning dummy stats for demo
    return res.json({
      totalLabs: 5,
      totalAppointments: 12,
      totalTests: 30,
      totalRevenue: 65000,
      pendingAppointments: 3,
      recentAppointments: [
        { id: '1', patient: 'John Doe', test: 'Blood Test', time: '10:00 AM', status: 'pending', date: '2025-04-15' },
        { id: '2', patient: 'Jane Smith', test: 'X-Ray', time: '11:30 AM', status: 'confirmed', date: '2025-04-16' },
        { id: '3', patient: 'Bob Johnson', test: 'MRI Scan', time: '02:15 PM', status: 'completed', date: '2025-04-17' }
      ],
      analytics: [
        { date: '2025-04-13', testsConducted: 5, revenue: 12000 },
        { date: '2025-04-14', testsConducted: 8, revenue: 18000 },
        { date: '2025-04-15', testsConducted: 6, revenue: 15000 },
        { date: '2025-04-16', testsConducted: 10, revenue: 25000 },
        { date: '2025-04-17', testsConducted: 4, revenue: 10000 }
      ]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
