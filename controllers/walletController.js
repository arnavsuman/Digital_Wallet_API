const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { is } = require('type-is');


exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Deposit amount must be positive' });

  try {
    const user = await User.findById(req.user._id);
    user.balance += amount;
    await user.save();

    // Rule 1: Large deposit
    const isFlagged = amount > 5000000;

    // Rule 2: 4 withdrawals within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recent = await Transaction.find({
      to: user._id,
      type: 'deposit',
      timestamp: { $gte: fiveMinutesAgo }
    });

    const transaction = new Transaction({
      type: 'deposit',
      to: user._id,
      amount,
      flagged: isFlagged,
    });
    await transaction.save();

    // REPORTING LOGS
    if (amount > 5000000 || recent.length > 3) {
      console.log(`[FLAGGED] High-value withdrawal of ${amount} by ${user.username} at Time ${transaction.timestamp.toISOString()}`);

      // send mail here
    }


    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Withdraw amount must be positive' });

  try {
    const user = await User.findById(req.user._id);
    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    // Proceed with withdrawal
    user.balance -= amount;
    await user.save();

    // Rule 1: Large transfer
    const isFlagged = amount > 5000000;

    // Rule 2: 4 withdrawals within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentWithdrawals = await Transaction.find({
      from: user._id,
      type: 'withdraw',
      timestamp: { $gte: fiveMinutesAgo }
    });

    const transaction = new Transaction({
      type: 'withdraw',
      from: user._id,
      amount,
      flagged: isFlagged ,
    });
    await transaction.save();

    // REPORTING LOGS
    if (amount > 5000000) {
      console.log(`[FLAGGED] High-value withdrawal of ${amount} by ${user.username} at Time ${transaction.timestamp.toISOString()}`);
    }
    if (recentWithdrawals.length > 3) {
      console.log(`[FLAGGED] ${recentWithdrawals.length} withdrawal in 5 mins by ${user.username} at Time ${transaction.timestamp.toISOString()}`);
    }

    res.json({ balance: user.balance, flagged });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.transfer = async (req, res) => {
  const { toUsername, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Transfer amount must be positive' });
  if (req.user.username === toUsername) return res.status(400).json({ message: 'Cannot transfer to self' });

  try {
    const sender = await User.findById(req.user._id);
    const receiver = await User.findOne({ username: toUsername });
    if (!receiver || receiver.deleted) return res.status(404).json({ message: 'Recipient user not found' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Rule 1: Large transfer
    const isFlagged = amount > 5000000;

    // Rule 2: 4 withdrawals within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentWithdrawals = await Transaction.find({
      from: sender._id,
      type: 'withdraw',
      timestamp: { $gte: fiveMinutesAgo }
    });

    //WRITE TRANSACTION

    const transaction = new Transaction({
      type: 'transfer',
      from: sender._id,
      to: receiver._id,
      amount,
      flagged: isFlagged,
    });
    await transaction.save();

    // REPORTING LOGS

    if (isFlagged) {
      console.log(`[FLAGGED] Large transfer flagged: ${amount} from ${sender.username} to ${receiver.username} at Time ${transaction.timestamp.toISOString()}`);
    }
    if (recentWithdrawals.length > 3) {
      isFlagged = true;
      console.log(`[FLAGGED] ${recentWithdrawals.length} transfers in 5 mins by ${sender.username} to ${receiver.username} at Time ${transaction.timestamp.toISOString()}`);
    }

    res.json({ balance: sender.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate('from', 'username')
      .populate('to', 'username')
      .sort({ timestamp: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.deleted) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    user.deleted = true;
    await user.save();

    res.json({ message: 'Your account has been marked as deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.deleted) {
      return res.status(403).json({ message: 'User not found or access revoked' });
    }

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

