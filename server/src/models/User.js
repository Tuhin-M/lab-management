
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please add a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lab_owner'],
    default: 'user'
  },
  labs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab'
  }],
  refreshToken: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  this.refreshToken = require('crypto').randomBytes(40).toString('hex');
  return this.refreshToken;
};

module.exports = mongoose.model('User', UserSchema);
