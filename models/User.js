const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  balance: { type: Number, default: 0, min: 0 },
  role: { type: String, enum: ['user', 'admin'],  }, // for admin check
  deleted: { type: Boolean, default: false } // soft delete flag
});

module.exports = mongoose.model('User', userSchema);
