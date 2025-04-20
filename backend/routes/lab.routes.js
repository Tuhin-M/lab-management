const express = require('express');
const Lab = require('../models/lab.model');
const router = express.Router();

// Create Lab
router.post('/labs', async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Labs
router.get('/labs', async (req, res) => {
  const labs = await Lab.find();
  res.json(labs);
});

module.exports = router;
