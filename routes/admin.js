const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminAuth');

const router = express.Router();

router.use(auth);
router.use(admin);

router.get('/flagged-transactions', adminController.getFlaggedTransactions);
router.get('/total-balances', adminController.getTotalBalances);
router.get('/top-users-balance', adminController.getTopUsersByBalance);
router.get('/top-users-volume', adminController.getTopUsersByVolume);
router.get('/fraud-reports', adminController.getFraudReports);
router.delete('/hard-delete-users', adminController.hardDeleteUsers);


module.exports = router;
