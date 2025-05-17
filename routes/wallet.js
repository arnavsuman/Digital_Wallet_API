const express = require('express');
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.post('/transfer', walletController.transfer);
router.get('/transactions', walletController.getTransactionHistory);
router.get('/balance', walletController.getBalance);
router.patch('/delete', walletController.softDelete);

module.exports = router;
