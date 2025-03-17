
const mongoose = require('mongoose');

const TestBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },
  tests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    price: Number
  }],
  bookingDate: {
    type: Date,
    required: [true, 'Please add booking date']
  },
  sampleCollectionDate: {
    type: Date,
    required: [true, 'Please add sample collection date']
  },
  sampleCollectionTime: {
    type: String,
    required: [true, 'Please add sample collection time']
  },
  homeCollection: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['booked', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'booked'
  },
  patientDetails: {
    name: String,
    age: Number,
    gender: String,
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  prescriptionImage: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  report: {
    url: String,
    uploadedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestBooking', TestBookingSchema);
