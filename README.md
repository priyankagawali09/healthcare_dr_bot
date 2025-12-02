# Healthcare Dr. Bot - Ayurvedic Medicine Finder

A multilingual healthcare platform connecting users with Ayurvedic and Allopathic medicines, nearby pharmacies, and home remedies.

## Features
- 🔍 Multi-language symptom search (English, Hindi, Marathi, Hinglish)
- 💊 Medicine database (Ayurvedic + Allopathic)
- 📍 Location-based pharmacy finder
- 👤 User & Pharmacist portals
- 🛒 Cart & checkout system
- 🏠 Home remedies
- ⭐ Ratings & reviews
- 🚨 Emergency contacts

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT

## Setup

### Database
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create `.env` files in backend and frontend directories (see `.env.example`)
