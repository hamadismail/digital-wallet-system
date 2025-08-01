# 💳 Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system — similar to Bkash or Nagad — built using **Express.js**, **Mongoose**, and **JWT**.

### 🔗 Live API:

**[https://digital-wallet-api-indol.vercel.app](https://digital-wallet-api-indol.vercel.app/)**

---

## 📌 Project Overview

This API simulates a digital wallet platform where users can perform essential financial operations such as adding, sending, and withdrawing money. It includes:

- 🔐 Secure authentication with JWT
- 🎭 Role-based authorization (`user`, `agent`, `admin`)
- 💰 Wallet auto-creation on registration
- 🔁 Transaction tracking and history
- 🛡️ Protected routes based on role

---

## 🚀 Features

- **User Registration/Login** with hashed passwords
- **JWT-based Authentication** and Role-Based Access Control
- **Automatic Wallet Creation** with initial balance on signup
- **Wallet Operations**
  - Add money
  - Withdraw money
  - Send money to another user
- **Agent Operations**
  - Cash-in (add money to users)
  - Cash-out (withdraw from users)
- **Admin Operations**
  - View all users, wallets, and transactions
  - Block/unblock wallets
  - Approve/suspend agents
- **Transaction History** tracking
- **Mongoose Transactions** to ensure atomicity and data consistency

---

## 🧰 Tech Stack

| Tech       | Usage                  |
| ---------- | ---------------------- |
| Node.js    | JavaScript runtime     |
| Express.js | Web framework          |
| MongoDB    | NoSQL database         |
| Mongoose   | ODM for MongoDB        |
| JWT        | Authentication         |
| bcryptjs   | Password hashing       |
| dotenv     | Environment management |
| Vercel     | Deployment             |

---

## 📮 API Endpoints

### 🔐 Auth (Public)

| Method | Endpoint                | Description                  |
| ------ | --------------------    | ---------------------------- |
| POST   | `/api/v1/user/register` | Register a new user or agent |
| POST   | `/api/v1/auth/login`    | Login with email & password  |

---

### 👤 User Routes (Requires role: `user`)

| Method | Endpoint                          | Description                |
| ------ | -----------------------           | -------------------------- |
| POST   | `/api/v1/user/add-money`          | Add money to own wallet    |
| POST   | `/api/v1/user/withdraw`           | Withdraw from own wallet   |
| POST   | `/api/v1/user/send`               | Send money to another user |
| GET    | `/api/v1/me/transaction-summary`  | View personal transactions |

---

### 🧑‍💼 Agent Routes (Requires role: `agent`)

| Method | Endpoint                   | Description                              |
| ------ | -------------------------  | ---------------------------------------- |
| POST   | `/api/v1/agent/cash-in`    | Add money to a user's wallet             |
| POST   | `/api/v1/agent/cash-out`   | Withdraw money from a user's wallet      |

---

### 🛠️ Admin Routes (Requires role: `admin`)

| Method | Endpoint                           | Description               |
| ------ | -------------------------------    | ------------------------- |
| GET    | `/api/v1/user/all-users`           | View all users and agents |
| PATCH  | `/api/v1/admin/wallet/block/:id`   | Block a wallet            |
| PATCH  | `/api/v1/user/make-agent/:id`.     | Approve an agent          |

---

## 🙌 Acknowledgements

Developed by **Hamad Ismail**
Hosted on **Vercel**
