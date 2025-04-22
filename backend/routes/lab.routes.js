const express = require('express');
const Lab = require('../models/lab.model');
const router = express.Router();
const auth = require('../middleware/auth');

// Create Lab
router.post('/labs', auth, async (req, res) => {
  try {
    const {
      labName,
      labDescription,
      establishedDate,
      registrationNumber,
      contactDetails,
      address,
      facilities,
      certifications,
      workingHours,
      staffDetails,
      servicesOffered
    } = req.body;

    // Validate required fields
    if (!labName || !registrationNumber || !contactDetails?.email || !contactDetails?.phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLab = new Lab({
      name: labName,
      description: labDescription,
      establishedDate,
      registrationNumber,
      contact: contactDetails,
      address,
      facilities,
      certifications,
      workingHours,
      staff: staffDetails,
      services: servicesOffered,
      owner: req.user.id
    });

    await newLab.save();
    
    res.status(201).json({
      id: newLab._id,
      name: newLab.name,
      message: 'Lab created successfully'
    });
  } catch (error) {
    console.error('Error creating lab:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Lab with this registration number already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all Labs
router.get('/labs', async (req, res) => {
  const labs = await Lab.find();
  res.json(labs);
});

module.exports = router;
