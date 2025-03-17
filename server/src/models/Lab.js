
const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    required: [true, 'Please add an address']
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  certifications: [String],
  operatingHours: {
    weekdays: {
      open: String,
      close: String
    },
    weekends: {
      open: String,
      close: String
    }
  },
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  image: {
    type: String,
    default: 'default-lab.jpg'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    rating: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lab', LabSchema);
