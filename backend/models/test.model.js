const mongoose = require('mongoose');
const TestSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: String,
  description: String,
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' }
});
module.exports = mongoose.model('Test', TestSchema);
