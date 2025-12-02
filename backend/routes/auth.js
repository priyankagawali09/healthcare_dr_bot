import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, city, role, 
            specialization, qualification, experience, consultationFee, availableDays, availableTime,
            storeName, storeAddress, licenseNumber } = req.body;
    
    console.log('Registration attempt:', { name, email, role, phone, city });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, phone, location, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, city || null, role || 'user']
    );

    const userId = result.insertId;

    // If doctor, create doctor profile
    if (role === 'doctor') {
      console.log('Creating doctor profile:', { name, specialization, qualification, experience, consultationFee, phone, city, availableDays, availableTime, email });
      await pool.execute(
        `INSERT INTO doctors (name, specialization, qualification, experience_years, consultation_fee, 
         phone, city, available_days, available_time, email) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, specialization, qualification, experience, consultationFee, phone, city, availableDays, availableTime, email]
      );
    }

    // If pharmacist, create medical store
    if (role === 'pharmacist') {
      await pool.execute(
        'INSERT INTO medical_store (store_name, address, contact_no, location) VALUES (?, ?, ?, ?)',
        [storeName, storeAddress, phone, city]
      );
    }

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    
    await pool.execute(
      'UPDATE users SET name = ?, location = ?, phone = ? WHERE user_id = ?',
      [name, location, phone, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
