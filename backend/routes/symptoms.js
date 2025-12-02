import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Search symptoms (multi-language)
router.get('/search', async (req, res) => {
  try {
    const { query, lang = 'en' } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const searchTerm = `%${query}%`;
    const [symptoms] = await pool.execute(
      `SELECT * FROM symptoms 
       WHERE disease_name LIKE ?OR marathi_name LIKE ?  OR minglish_name LIKE ? OR symptom_desc LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicines for symptom
router.get('/:id/medicines', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'ayurvedic' or 'allopathic'
    
    let query = `
      SELECT m.* 
      FROM medicines m
      JOIN symptom_medicine_map sm ON m.medicine_id = sm.medicine_id
      WHERE sm.symptom_id = ?
    `;
    
    const params = [id];
    
    if (type) {
      query += ' AND m.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY m.medicine_name';
    
    const [medicines] = await pool.execute(query, params);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get home remedies for symptom
router.get('/:id/remedies', async (req, res) => {
  try {
    const { id} = req.params;
    const [remedies] = await pool.execute(
      'SELECT * FROM home_remedies WHERE symptom_id = ?',
      [id]
    );
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
