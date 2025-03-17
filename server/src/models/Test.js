
const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  preparationNeeded: {
    type: String,
    default: 'No special preparation required'
  },
  timeRequired: {
    type: String,
    default: '1 day'
  },
  reportTime: {
    type: String,
    default: '24 hours'
  },
  homeCollection: {
    type: Boolean,
    default: false
  },
  homeCollectionFee: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  labs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', TestSchema);
