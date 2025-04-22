const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  establishedDate: Date,
  registrationNumber: { type: String, required: true, unique: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    emergencyContact: String,
    website: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' },
    landmark: String
  },
  facilities: [String],
  certifications: [String],
  workingHours: {
    weekdays: { open: String, close: String },
    weekends: { open: String, close: String },
    holidays: { open: String, close: String }
  },
  staff: {
    pathologists: { type: Number, default: 0 },
    technicians: { type: Number, default: 0 },
    receptionists: { type: Number, default: 0 }
  },
  services: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lab', labSchema);
