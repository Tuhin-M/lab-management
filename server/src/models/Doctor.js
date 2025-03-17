
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Please add a specialty']
  },
  qualifications: [String],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  hospital: {
    type: String,
    required: [true, 'Please add hospital/clinic name']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee']
  },
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
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
  image: {
    type: String,
    default: 'default-doctor.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
