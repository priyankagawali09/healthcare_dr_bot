import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const [medicines] = await pool.execute('SELECT * FROM medicines ORDER BY medicine_name');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const [medicines] = await pool.execute('SELECT * FROM medicines WHERE medicine_id = ?', [req.params.id]);
    if (medicines.length === 0) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicines[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new medicine
router.post('/', async (req, res) => {
  try {
    const { name, type, company, composition, price } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO medicines (medicine_name, type, company_name, composition, price) VALUES (?, ?, ?, ?, ?)',
      [name, type, company, composition, price]
    );
    
    res.status(201).json({ message: 'Medicine added', medicineId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
