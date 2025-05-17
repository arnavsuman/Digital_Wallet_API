const User = require('../models/User');
const Transaction = require('../models/Transaction');
const FraudReport = require('../models/FraudReport');

exports.getFlaggedTransactions = async (req, res) => {
  try {
    const flaggedTxs = await Transaction.find({ flagged: true })
      .populate('from', 'username')
      .populate('to', 'username');
    res.json(flaggedTxs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTotalBalances = async (req, res) => {
  try {
    const total = await User.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: null, totalBalance: { $sum: '$balance' } } }
    ]);
    res.json({ totalBalance: total[0]?.totalBalance || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopUsersByBalance = async (req, res) => {
  try {
    const users = await User.find({ deleted: false })
      .sort({ balance: -1 })
      .limit(10)
      .select('username balance');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopUsersByVolume = async (req, res) => {
  try {
    const volumes = await Transaction.aggregate([
      {
        $group: {
          _id: '$from',
          totalVolume: { $sum: '$amount' }
        }
      },
      { $sort: { totalVolume: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          totalVolume: 1
        }
      }
    ]);
    res.json(volumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFraudReports = async (req, res) => {
  try {
    const reports = await FraudReport.find()
      .sort({ date: -1 })
      .populate('suspiciousTransactions.from suspiciousTransactions.to');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hardDeleteUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({ deleted: true });
    res.json({ message: `${result.deletedCount} user(s) permanently deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
