const Transaction = require("../models/Transaction");

const checkAnomalies = async (user, type, amount) => {
  const oneMinAgo = new Date(Date.now() - 60 * 1000);
  const recentTransfers = await Transaction.find({
    from: user.username,
    type: "transfer",
    timestamp: { $gte: oneMinAgo }
  });

  let isFlagged = false;
  if (type === "transfer" && recentTransfers.length >= 5) {
    isFlagged = true;
  }

  if (type === "withdraw" && amount > 50000) {
    isFlagged = true;
  }

  return isFlagged;
};

module.exports = { checkAnomalies };
