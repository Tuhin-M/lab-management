const express = require('express');
const Test = require('../models/test.model');
const router = express.Router();

// Create Test for a Lab
router.post('/labs/:labId/tests', async (req, res) => {
  try {
    const test = new Test({ ...req.body, lab: req.params.labId });
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Tests for a Lab
router.get('/labs/:labId/tests', async (req, res) => {
  const tests = await Test.find({ lab: req.params.labId });
  res.json(tests);
});

module.exports = router;
