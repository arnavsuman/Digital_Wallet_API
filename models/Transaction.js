const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // null for deposit
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },   // null for withdraw
  type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
  amount: { type: Number, required: true, min: 0 },
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
