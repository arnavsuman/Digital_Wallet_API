# Digital Wallet System

A secure and scalable digital wallet backend system built using Node.js, Express.js, MongoDB (Atlas), and JWT for authentication. This application supports wallet operations such as registration, login, deposit, withdraw, transfer, transaction history, soft-delete, and admin fraud monitoring.

Project DEmonstatation Video Link - 

## Features

* User registration and login with JWT authentication

* Deposit, withdrawal, and transfer operations

* Soft delete functionality for users

* Transaction history retrieval

* Fraud detection rules

* Admin APIs for listing and reviewing transactions

* MongoDB Atlas for cloud database

* Middleware for route protection

## Technologies Used

* Node.js

* Express.js

* MongoDB Atlas

* Mongoose

* JSON Web Tokens (JWT)

* Node Cron (for scheduled fraud scan)

* Render (for hosting)


# Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/digital-wallet-system.git
cd digital-wallet-system
```
### 2. Install Dependencies
   npm install

### 3. Set Up Environment Variables
Create a .env file in the root directory and add the following:
```nginx
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRY=1d
```
### 4. Start the Server
   npm start
By default, the server runs on http://localhost:5000


# API Authentication Routes

### POST /api/auth/register
Registers a new user.
```bash
https://digital-wallet-api-53o8.onrender.com/api/auth/register
```

```json
{
  "username": "testuser",
  "password": "securePassword"
}
```

### POST /api/auth/login
Authenticates user for login to account and returns a JWT token.
```bash
https://digital-wallet-api-53o8.onrender.com/api/auth/login
```
```json
{
  "username": "testuser",
  "password": "securePassword"
}
```

# Wallet Routes (JWT Protected)
Add this header to all wallet/admin requests:
```nginx
Authorization: Bearer <token>
```

### POST /api/wallet/deposit
deposit virtual money into account
```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/deposit
```
```json
{
  "amount": 1000
}
```
### POST /api/wallet/withdraw
Withdraw virtual money from account
```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/withdraw
```
```json
{
  "amount": 500
}
```

### POST /api/wallet/transfer
Transfer virtual money from your account to other account using username

```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/transfer
```
```json
{
  "toUsername": "recipientUsername",
  "amount": 200
}
```

### GET /api/wallet/balance
Returns the current wallet balance.
```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/balance
```


### GET /api/wallet/transactions
Returns an array of recent transactions for the logged-in user.
```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/transactions
```


### PATCH /api/wallet/delete
```bash
https://digital-wallet-api-53o8.onrender.com/api/wallet/delete
```
Soft-deletes the user by setting a deleted flag.


# Admin Routes (JWT Protected)

### POST /api/auth/login
Authenticates admin for login to account and returns admin JWT token.
```bash
https://digital-wallet-api-53o8.onrender.com/api/auth/login
```
```json
{
  "username": "admin",
  "password": "admin"
}
```

### GET /api/admin/flagged-transactions
Returns all flagged transactions (fraud or suspicious).
```bash
https://digital-wallet-api-53o8.onrender.com/api/admin/flagged-transactions
```

### GET /api/admin/total-balances
Returns sum of total balance across all accounts
```bash
https://digital-wallet-api-53o8.onrender.com/api/admin/total-balances
```

### GET /api/admin/top-users-balance
Returns list of top users by balance in accounts
```bash
https://digital-wallet-api-53o8.onrender.com/api/admin/top-users-balance
```

### GET /api/admin/top-users-volume
Returns list of top users by volume traded
```bash
https://digital-wallet-api-53o8.onrender.com/api/admin/top-users-volume
```

### DELETE /api/admin/hard-delete-users
Performs hard delete of users already marked for account deletion ad hoc
```bash
https://digital-wallet-api-53o8.onrender.com/api/admin/hard-delete-users
```

# Fraud Detection Rules
* Large Transfers: Any transfer above 5,000,000 units is flagged.

* Frequent Withdrawals: More than 3 withdrawals within 5 minutes flags further withdrawals.

* Scheduled Scanning: A cron job (jobs/fraudScan.js) runs at intervals to detect patterns in recent transactions.

# Postman Testing
Use Postman to test the APIs by sending requests with:
```nginx
Content-Type: application/json

Authorization: Bearer <your-token> (for protected routes)
```
# License
This project is licensed under the MIT License.

