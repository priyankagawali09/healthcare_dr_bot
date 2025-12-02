import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

import { notifyOrderPlaced, notifyOrderCancelled } from '../utils/notifications.js';

// Create order
router.post('/', authenticate, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { items, totalAmount, deliveryAddress, contactNumber, paymentMethod } = req.body;
    
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_address, contact_number, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [req.user.id, totalAmount, deliveryAddress, contactNumber, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Send SMS notification
    await notifyOrderPlaced(contactNumber, orderId, totalAmount);
    
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.medicineId, item.quantity, item.price]
      );
    }
    
    // Clear cart
    const [carts] = await connection.execute('SELECT cart_id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length > 0) {
      await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].cart_id]);
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.* FROM orders o
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.execute(
        `SELECT oi.*, m.medicine_name, m.company_name 
         FROM order_items oi
         JOIN medicines m ON oi.medicine_id = m.medicine_id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    // Get order details for notification
    const [orders] = await pool.execute(
      'SELECT contact_number FROM orders WHERE order_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    await pool.execute(
      'UPDATE orders SET status = ? WHERE order_id = ? AND user_id = ? AND status = ?',
      ['cancelled', req.params.id, req.user.id, 'pending']
    );
    
    // Send cancellation SMS
    if (orders.length > 0) {
      await notifyOrderCancelled(orders[0].contact_number, req.params.id);
    }
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
