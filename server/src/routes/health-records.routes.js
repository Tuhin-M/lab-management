
const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const auth = require('../middleware/auth');

// @route   GET /api/health-records
// @desc    Get all health records for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({ user: req.user.id })
      .sort({ date: -1 });
    
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
    
    const newHealthRecord = new HealthRecord({
      user: req.user.id,
      recordType,
      title,
      date: date || Date.now(),
      doctorName,
      hospitalName,
      description,
      fileUrl,
      metrics,
      tags
    });
    
    const healthRecord = await newHealthRecord.save();
    
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
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    // Check user owns the health record
    if (healthRecord.user.toString() !== req.user.id) {
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
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    // Check user owns the health record
    if (healthRecord.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await healthRecord.remove();
    
    res.json({ message: 'Health record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
