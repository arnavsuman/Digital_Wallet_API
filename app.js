require('dotenv').config();
require('./jobs/fraudScan');

const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Digital Wallet System</h1>
    <p>Available Routes:</p>
    <ul>
      <li><code>POST /api/auth/register</code> – Register a new user</li>
      <li><code>POST /api/auth/login</code> – Login and get a token</li>
      <li><code>GET /api/wallet/balance</code> – View wallet balance</li>
      <li><code>POST /api/wallet/deposit</code> – Deposit funds</li>
      <li><code>POST /api/wallet/transfer</code> – Transfer funds</li>
      <li><code>PATCH /api/wallet/delete</code> – Soft delete account</li>
      <li><code>DELETE /api/admin/users/hard-delete</code> – Admin only: Hard delete users</li>
    </ul>
    <h1>Made by Arnav Suman</h1>
  `);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
