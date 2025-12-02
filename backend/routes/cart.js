import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get or create user cart
router.get('/', authenticate, async (req, res) => {
  try {
    const [carts] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ?',
      [req.user.id]
    );
    
    if (carts.length === 0) {
      res.json({ cart_id: null, items: [] });
    } else {
      const [items] = await pool.execute(
        `SELECT ci.*, m.medicine_name, m.price, m.company_name
         FROM cart_items ci
         JOIN medicines m ON ci.medicine_id = m.medicine_id
         WHERE ci.cart_id = ?`,
        [carts[0].cart_id]
      );
      res.json({ cart_id: carts[0].cart_id, items });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create cart
router.post('/create', authenticate, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO cart (user_id) VALUES (?)',
      [req.user.id]
    );
    res.status(201).json({ cart_id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/items', authenticate, async (req, res) => {
  try {
    const { medicineId, quantity, price } = req.body;
    
    // Get or create cart
    let [carts] = await pool.execute(
      'SELECT cart_id FROM cart WHERE user_id = ?',
      [req.user.id]
    );
    
    let cartId;
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [req.user.id]
      );
      cartId = result.insertId;
    } else {
      cartId = carts[0].cart_id;
    }
    
    // Add item
    const [result] = await pool.execute(
      `INSERT INTO cart_items (cart_id, medicine_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [cartId, medicineId, quantity, price]
    );
    
    res.status(201).json({ message: 'Added to cart', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/items/:id', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE item_id = ?',
      [quantity, req.params.id]
    );
    res.json({ message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/items/:id', authenticate, async (req, res) => {
  try {
    await pool.execute('DELETE FROM cart_items WHERE item_id = ?', [req.params.id]);
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
