import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Add review
router.post('/', authenticate, async (req, res) => {
  try {
    const { medicineId, pharmacyId, rating, reviewText } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, medicine_id, pharmacy_id, rating, review_text) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, medicineId, pharmacyId, rating, reviewText]
    );
    
    res.status(201).json({ message: 'Review added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for medicine/pharmacy
router.get('/', async (req, res) => {
  try {
    const { medicineId, pharmacyId } = req.query;
    let query = 'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE 1=1';
    const params = [];
    
    if (medicineId) {
      query += ' AND r.medicine_id = ?';
      params.push(medicineId);
    }
    if (pharmacyId) {
      query += ' AND r.pharmacy_id = ?';
      params.push(pharmacyId);
    }
    
    query += ' ORDER BY r.created_at DESC';
    
    const [reviews] = await pool.execute(query, params);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
