# Vehicle Service & Maintenance Management System

A server-side rendered (SSR) web application built using **Node.js**, **Express**, **EJS**, and **MongoDB (Mongoose)** for managing vehicle services, maintenance schedules, and customer vehicle records.

---

## 🚀 Features

- **User Authentication & Role-Based Access Control**:
  - Customer registration and login
  - Admin and Customer roles
  - Cookie-based session tracking
- **Vehicle Management**:
  - Add and register new vehicles
  - View list of owned vehicles
  - Complete vehicle service history and timeline
- **Service Booking & Tracking**:
  - Book maintenance and repair service appointments
  - Admin service status updates (Pending, In Progress, Completed, etc.)
  - Service cost, notes, and completion logging
- **Admin Dashboard**:
  - Overview of all vehicles and service requests across customers
  - Quick action to complete or update service orders

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database & ODM**: MongoDB, Mongoose
- **View Engine**: EJS (Embedded JavaScript)
- **Styling**: Vanilla CSS
- **Authentication**: Cookie Parser, Custom Auth Middleware

---

## 📂 Project Structure

```
.
├── config/
│   └── db.js                 # Database connection setup
├── controllers/
│   ├── authController.js     # User registration and authentication logic
│   ├── serviceController.js  # Service booking and status management
│   └── vehicleController.js  # Vehicle registration and history
├── middleware/
│   └── authMiddleware.js     # Route protection & role checks
├── models/
│   ├── serviceModel.js       # Service appointment schema
│   ├── userModel.js          # User and role schema
│   └── vehicleModel.js       # Vehicle details schema
├── public/
│   └── style.css             # Application styling
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── serviceRoutes.js      # Service booking endpoints
│   └── vehicleRoutes.js      # Vehicle endpoints
├── views/                    # EJS dynamic UI templates
├── app.js                    # Express app entry point
├── package.json              # Project dependencies & scripts
└── .env.example              # Environment variables template
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tejaa11/Vehicle-Service-Maintenance-Management-System.git
cd Vehicle-Service-Maintenance-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the Application

For production / normal run:
```bash
npm start
```

For development (with nodemon):
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.
