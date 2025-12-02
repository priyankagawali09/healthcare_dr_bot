# 🏥 Healthcare Dr. Bot

> A comprehensive MERN stack healthcare platform bridging traditional Ayurvedic and modern Allopathic medicine with intelligent symptom analysis, doctor consultations, and pharmacy management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 Multi-Language Symptom Search
- Search symptoms in **English, Hindi, Marathi, and Hinglish**
- AI-powered medicine recommendations (Ayurvedic & Allopathic)
- Home remedies and natural treatments
- Search history with user feedback ratings

### 🩺 Doctor Consultation System
- Book appointments with verified doctors
- Real-time **SMS notifications** for patients and doctors
- Doctor dashboard with appointment management
- Specialization-based doctor search
- Rating and review system

### 💊 Pharmacy Management
- **Location-based pharmacy finder**
- Real-time inventory management for pharmacists
- Medicine availability tracking
- Price comparison across stores
- Pharmacist dashboard for stock management

### 🛒 E-Commerce Features
- Shopping cart with medicine ordering
- Order tracking and management
- SMS notifications for order status
- Delivery address management
- Order history

### 📱 SMS Notification System
- Order confirmations with price and timestamp
- Appointment booking/cancellation alerts
- Doctor appointment notifications
- Real-time status updates

### 🎨 Modern UI/UX
- **Glassmorphism design** with dark theme
- Smooth animations and transitions
- Responsive layout for all devices
- Intuitive navigation

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- CSS3 with glassmorphism effects

### Backend
- **Node.js** with Express.js
- MySQL database
- JWT authentication
- bcrypt for password hashing
- RESTful API architecture

### Database
- **MySQL** with 15+ tables
- Proper relationships and foreign keys
- UTF-8 encoding for multilingual support

---


## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/priyankagawali09/healthcare_dr_bot.git
cd healthcare_dr_bot
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < database/your_schema.sql
mysql -u root -p < database/your_seed.sql
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=healthcare_db
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend server
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update .env:
# VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🗄️ Database Setup

The database consists of 15 interconnected tables:

### Core Tables
- `users` - User accounts (patients, doctors, pharmacists)
- `doctors` - Doctor profiles and specializations
- `medical_store` - Pharmacy information
- `symptoms` - Symptom database (multilingual)
- `medicines` - Medicine catalog (Ayurvedic & Allopathic)
- `home_remedies` - Natural treatment suggestions

### Transaction Tables
- `consultations` - Doctor appointments
- `orders` - Medicine orders
- `order_items` - Order details
- `cart` - Shopping cart
- `cart_items` - Cart items
- `store_inventory` - Pharmacy stock management

### Supporting Tables
- `symptom_medicine_map` - Links symptoms to medicines
- `search_history` - User search tracking
- `reviews` - Ratings and feedback

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - User registration
POST   /api/auth/login       - User login
PUT    /api/auth/profile     - Update profile
```

### Symptoms & Medicines
```
GET    /api/symptoms/search           - Search symptoms
GET    /api/symptoms/:id/medicines    - Get medicines for symptom
GET    /api/symptoms/:id/remedies     - Get home remedies
GET    /api/medicines                 - Get all medicines
POST   /api/medicines                 - Add new medicine
```

### Doctors & Consultations
```
GET    /api/doctors                      - Get all doctors
POST   /api/doctors/consultations        - Book appointment
GET    /api/doctors/consultations        - Get user appointments
GET    /api/doctors/my-appointments      - Get doctor's appointments
PUT    /api/doctors/consultations/:id    - Update appointment
DELETE /api/doctors/consultations/:id/cancel - Cancel appointment
```

### Pharmacy & Stores
```
GET    /api/stores/all                - Get all stores
GET    /api/stores/my-store           - Get pharmacist's store
GET    /api/stores/:id/inventory      - Get store inventory
POST   /api/stores/inventory          - Add to inventory
PUT    /api/stores/inventory/:id      - Update inventory
GET    /api/stores/nearby             - Find nearby stores
```

### Cart & Orders
```
GET    /api/cart                - Get user cart
POST   /api/cart                - Add to cart
PUT    /api/cart/:id            - Update cart item
DELETE /api/cart/:id            - Remove from cart
POST   /api/orders              - Place order
GET    /api/orders              - Get user orders
PUT    /api/orders/:id/cancel   - Cancel order
```

### History & Reviews
```
GET    /api/history              - Get search history
POST   /api/history              - Add to history
DELETE /api/history/:id          - Delete history item
PUT    /api/history/:id/feedback - Add feedback
POST   /api/reviews              - Add review
GET    /api/reviews              - Get reviews
```

---

## 👥 User Roles

### 1. User (Patient)
- Search symptoms and get medicine recommendations
- Book doctor appointments
- Order medicines from pharmacies
- View order and appointment history
- Rate doctors and medicines

### 2. Doctor
- View and manage appointments
- See patient details and symptoms
- Mark appointments as completed
- Receive SMS notifications for new appointments

### 3. Pharmacist
- Manage store inventory
- Add new medicines to database
- Update stock quantities and prices
- Track medicine availability
- View store analytics

### 4. Admin
- System administration
- User management
- Content moderation

---

## 🔐 Security Features

- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt
- **Role-based access control** (RBAC)
- **SQL injection prevention** with parameterized queries
- **XSS protection** with input sanitization
- **CORS configuration** for API security
- **Environment variables** for sensitive data

---

## 📱 SMS Integration

The platform is ready for SMS integration with popular providers:

### Supported Providers
- **Twilio** - Global SMS service
- **MSG91** - Indian SMS gateway
- **Fast2SMS** - Fast delivery service

### SMS Notifications Include
- Order confirmations with details
- Appointment booking confirmations
- Appointment cancellations
- Doctor notifications for new appointments
- Order status updates

---

## 🎯 Future Enhancements

- [ ] AI/ML-based symptom prediction
- [ ] Video consultation feature
- [ ] Electronic prescription management
- [ ] Medicine reminder system
- [ ] Health records storage (EMR)
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Telemedicine features
- [ ] Lab test booking
- [ ] Health insurance integration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Priyanka Gawali**
- GitHub: [@priyankagawali09](https://github.com/priyankagawali09)
- Repository: [healthcare_dr_bot](https://github.com/priyankagawali09/healthcare_dr_bot)

---

## 🙏 Acknowledgments

- Ayurvedic medicine database contributors
- Medical symptom datasets
- Open-source community
- React and Node.js communities

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by Priyanka Gawali

</div>
