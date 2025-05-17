const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const FraudReport = require('../models/FraudReport');

console.log("Daily Fraud Scan Scheduled for 12 am")
cron.schedule('0 0 * * *', async () => {
  console.log(`[FRAUD SCAN] Running daily fraud check: ${new Date().toISOString()}`);

  try {
    const suspiciousTxns = await Transaction.find({
      flagged: true,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // last 24 hrs
    }).populate('from to');

    if (suspiciousTxns.length > 0) {
      const report = new FraudReport({
        suspiciousTransactions: suspiciousTxns.map(txn => ({
          type: txn.type,
          amount: txn.amount,
          from: txn.from?._id,
          to: txn.to?._id,
          timestamp: txn.timestamp
        }))
      });

      await report.save();
      console.log(`[FRAUD SCAN] ${suspiciousTxns.length} suspicious transactions saved to MongoDB.`);
    } else {
      console.log('[FRAUD SCAN] No flagged transactions to report today.');
    }

  } catch (err) {
    console.error('[FRAUD SCAN ERROR]', err.message);
  }
});
