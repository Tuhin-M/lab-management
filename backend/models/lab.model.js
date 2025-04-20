const mongoose = require('mongoose');
const LabSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  // Add other fields as needed
});
module.exports = mongoose.model('Lab', LabSchema);
