
const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  suspiciousTransactions: [
    {
      type: { type: String },
      amount: Number,
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date
    }
  ]
});

module.exports = mongoose.model('FraudReport', fraudReportSchema);
