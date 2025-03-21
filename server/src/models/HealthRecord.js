
const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'test_result', 'health_metric', 'doctor_note'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  doctorName: String,
  hospitalName: String,
  description: String,
  fileUrl: String,
  metrics: {
    height: Number,
    weight: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    bloodSugar: Number,
    cholesterol: {
      total: Number,
      hdl: Number,
      ldl: Number
    }
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
