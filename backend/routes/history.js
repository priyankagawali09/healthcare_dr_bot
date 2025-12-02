import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user search history
router.get('/', authenticate, async (req, res) => {
  try {
    const [history] = await pool.execute(
      `SELECT h.*, s.disease_name, s.marathi_name, s.minglish_name
       FROM search_history h
       JOIN symptoms s ON h.symptom_id = s.symptom_id
       WHERE h.user_id = ?
       ORDER BY h.searched_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to search history
router.post('/', authenticate, async (req, res) => {
  try {
    const { symptomId, searchQuery } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO search_history (user_id, symptom_id, search_query) VALUES (?, ?, ?)',
      [req.user.id, symptomId, searchQuery]
    );
    
    res.status(201).json({ message: 'History saved', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add feedback to history
router.put('/:id/feedback', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    
    await pool.execute(
      'UPDATE search_history SET feedback_rating = ? WHERE history_id = ? AND user_id = ?',
      [rating, req.params.id, req.user.id]
    );
    
    res.json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete single history item
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM search_history WHERE history_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'History deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear all history
router.delete('/all', authenticate, async (req, res) => {
  try {
    await pool.execute('DELETE FROM search_history WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
