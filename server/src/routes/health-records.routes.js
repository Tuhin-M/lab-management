
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// @route   GET /api/health-records
// @desc    Get all health records for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const healthRecords = await prisma.healthRecord.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });

    res.json(healthRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/health-records
// @desc    Create a new health record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      recordType,
      title,
      date,
      doctorName,
      hospitalName,
      description,
      fileUrl,
      metrics,
      tags
    } = req.body;

    const healthRecord = await prisma.healthRecord.create({
      data: {
        userId: req.user.id,
        recordType: recordType || 'other',
        title,
        date: date ? new Date(date) : new Date(),
        doctorName: doctorName || null,
        hospitalName: hospitalName || null,
        description: description || null,
        fileUrl: fileUrl || null,
        metrics: metrics || null,
        tags: tags || []
      }
    });

    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/health-records/:id
// @desc    Get health record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const healthRecord = await prisma.healthRecord.findUnique({
      where: { id: req.params.id }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Check user owns the health record
    if (healthRecord.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/health-records/:id
// @desc    Delete a health record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const healthRecord = await prisma.healthRecord.findUnique({
      where: { id: req.params.id }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Check user owns the health record
    if (healthRecord.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await prisma.healthRecord.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Health record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

module.exports = router;
