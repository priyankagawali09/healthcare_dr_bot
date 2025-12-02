import express from 'express';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get store inventory
router.get('/:id/inventory', async (req, res) => {
  try {
    const { id } = req.params;
    const [inventory] = await pool.execute(
      `SELECT si.*, m.medicine_name, m.type, m.company_name
       FROM store_inventory si
       JOIN medicines m ON si.medicine_id = m.medicine_id
       WHERE si.store_id = ?`,
      [id]
    );
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add medicine to store inventory
router.post('/inventory', authenticate, authorize('pharmacist'), async (req, res) => {
  try {
    const { storeId, medicineId, stockQuantity, expiryDate } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO store_inventory (store_id, medicine_id, stock_quantity, expiry_date, is_available)
       VALUES (?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE stock_quantity = stock_quantity + ?, expiry_date = ?`,
      [storeId, medicineId, stockQuantity, expiryDate, stockQuantity, expiryDate]
    );
    
    res.status(201).json({ message: 'Inventory updated', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's store
router.get('/my-store', authenticate, async (req, res) => {
  try {
    // First check if user has a linked store in users table
    const [users] = await pool.execute(
      'SELECT u.*, ms.* FROM users u LEFT JOIN medical_store ms ON u.user_id = ms.owner_user_id WHERE u.user_id = ?',
      [req.user.id]
    );
    
    if (users.length > 0 && users[0].store_id) {
      // User has a linked store
      return res.json({
        store_id: users[0].store_id,
        store_name: users[0].store_name,
        address: users[0].address,
        contact_no: users[0].contact_no,
        location: users[0].location
      });
    }

    // Fallback: Find store by matching user's email or phone
    const [stores] = await pool.execute(
      `SELECT * FROM medical_store 
       WHERE contact_no IN (SELECT phone FROM users WHERE user_id = ?)
       OR store_id = (SELECT MAX(store_id) FROM medical_store)
       LIMIT 1`,
      [req.user.id]
    );
    
    if (stores.length > 0) {
      res.json(stores[0]);
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all stores
router.get('/all', async (req, res) => {
  try {
    const [stores] = await pool.execute('SELECT * FROM medical_store ORDER BY store_name');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inventory
router.put('/inventory/:id', authenticate, authorize('pharmacist'), async (req, res) => {
  try {
    const { stockQuantity, expiryDate, price, isAvailable } = req.body;
    
    console.log('Updating inventory:', { id: req.params.id, stockQuantity, expiryDate, price, isAvailable });
    
    await pool.execute(
      `UPDATE store_inventory 
       SET stock_quantity = ?, expiry_date = ?, price = ?, is_available = ?
       WHERE inventory_id = ?`,
      [stockQuantity, expiryDate, price, isAvailable, req.params.id]
    );
    
    res.json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get nearby stores
router.get('/nearby', async (req, res) => {
  try {
    const { location, medicineId } = req.query;
    
    let query = 'SELECT * FROM medical_store';
    const params = [];
    
    if (location) {
      query += ' WHERE location LIKE ?';
      params.push(`%${location}%`);
    }
    
    const [stores] = await pool.execute(query, params);
    
    // If medicineId provided, check availability
    if (medicineId && stores.length > 0) {
      const storeIds = stores.map(s => s.store_id);
      const placeholders = storeIds.map(() => '?').join(',');
      
      const [availability] = await pool.execute(
        `SELECT store_id, stock_quantity FROM store_inventory 
         WHERE medicine_id = ? AND store_id IN (${placeholders}) AND is_available = TRUE`,
        [medicineId, ...storeIds]
      );
      
      const availabilityMap = {};
      availability.forEach(a => {
        availabilityMap[a.store_id] = a.stock_quantity;
      });
      
      stores.forEach(store => {
        store.has_medicine = !!availabilityMap[store.store_id];
        store.stock = availabilityMap[store.store_id] || 0;
      });
    }
    
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
