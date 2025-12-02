import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { city, specialization } = req.query;
    
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];
    
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    
    if (specialization) {
      query += ' AND specialization LIKE ?';
      params.push(`%${specialization}%`);
    }
    
    query += ' ORDER BY rating DESC';
    
    const [doctors] = await pool.execute(query, params);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

import { notifyAppointmentBooked, notifyDoctorAppointment, notifyAppointmentCancelled, notifyAppointmentUpdated } from '../utils/notifications.js';

// Book consultation
router.post('/consultations', authenticate, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, symptoms, consultationFee } = req.body;
    
    console.log('Booking consultation:', { doctorId, appointmentDate, appointmentTime, userId: req.user.id });
    
    // Get user and doctor details
    const [users] = await pool.execute('SELECT name, phone FROM users WHERE user_id = ?', [req.user.id]);
    const [doctors] = await pool.execute('SELECT name, phone FROM doctors WHERE doctor_id = ?', [doctorId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const [result] = await pool.execute(
      `INSERT INTO consultations (user_id, doctor_id, appointment_date, appointment_time, symptoms, consultation_fee, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, doctorId, appointmentDate, appointmentTime, symptoms, consultationFee]
    );
    
    // Send notifications
    if (users[0].phone) {
      await notifyAppointmentBooked(users[0].phone, doctors[0].name, appointmentDate, appointmentTime);
    }
    
    if (doctors[0].phone) {
      await notifyDoctorAppointment(doctors[0].phone, users[0].name, appointmentDate, appointmentTime, symptoms);
    }
    
    res.status(201).json({ message: 'Consultation booked', consultationId: result.insertId });
  } catch (error) {
    console.error('Consultation booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user consultations
router.get('/consultations', authenticate, async (req, res) => {
  try {
    const [consultations] = await pool.execute(
      `SELECT c.*, d.name as doctor_name, d.specialization, d.phone as doctor_phone
       FROM consultations c
       JOIN doctors d ON c.doctor_id = d.doctor_id
       WHERE c.user_id = ?
       ORDER BY c.appointment_date DESC, c.appointment_time DESC`,
      [req.user.id]
    );
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor's appointments
router.get('/my-appointments', authenticate, async (req, res) => {
  try {
    // Get doctor_id from users email
    const [doctors] = await pool.execute('SELECT doctor_id FROM doctors WHERE email = ?', [req.user.email]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    const doctorId = doctors[0].doctor_id;
    
    const [appointments] = await pool.execute(
      `SELECT c.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
       FROM consultations c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.doctor_id = ?
       ORDER BY c.appointment_date DESC, c.appointment_time DESC`,
      [doctorId]
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status (for doctors)
router.put('/appointments/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE consultations SET status = ? WHERE consultation_id = ?',
      [status, req.params.id]
    );
    
    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update consultation
router.put('/consultations/:id', authenticate, async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    
    // Get consultation details
    const [consultations] = await pool.execute(
      `SELECT c.*, u.phone as user_phone, d.phone as doctor_phone, d.name as doctor_name
       FROM consultations c
       JOIN users u ON c.user_id = u.user_id
       JOIN doctors d ON c.doctor_id = d.doctor_id
       WHERE c.consultation_id = ? AND c.user_id = ?`,
      [req.params.id, req.user.id]
    );
    
    if (consultations.length === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    await pool.execute(
      'UPDATE consultations SET appointment_date = ?, appointment_time = ? WHERE consultation_id = ?',
      [appointmentDate, appointmentTime, req.params.id]
    );
    
    // Send update notifications
    const consultation = consultations[0];
    await notifyAppointmentUpdated(consultation.user_phone, req.params.id, consultation.doctor_name, appointmentDate, appointmentTime);
    await notifyAppointmentUpdated(consultation.doctor_phone, req.params.id, consultation.doctor_name, appointmentDate, appointmentTime);
    
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel consultation
router.put('/consultations/:id/cancel', authenticate, async (req, res) => {
  try {
    // Get consultation details
    const [consultations] = await pool.execute(
      `SELECT c.*, u.phone as user_phone, d.phone as doctor_phone 
       FROM consultations c
       JOIN users u ON c.user_id = u.user_id
       JOIN doctors d ON c.doctor_id = d.doctor_id
       WHERE c.consultation_id = ?`,
      [req.params.id]
    );
    
    await pool.execute(
      'UPDATE consultations SET status = ? WHERE consultation_id = ? AND user_id = ? AND status = ?',
      ['cancelled', req.params.id, req.user.id, 'pending']
    );
    
    // Send cancellation notifications
    if (consultations.length > 0) {
      await notifyAppointmentCancelled(consultations[0].user_phone, req.params.id);
      await notifyAppointmentCancelled(consultations[0].doctor_phone, req.params.id);
    }
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add doctor feedback
router.post('/doctors/:id/feedback', authenticate, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    
    // Add review
    await pool.execute(
      'INSERT INTO reviews (user_id, doctor_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [req.user.id, req.params.id, rating, reviewText]
    );
    
    // Update doctor average rating
    const [avgResult] = await pool.execute(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE doctor_id = ?',
      [req.params.id]
    );
    
    await pool.execute(
      'UPDATE doctors SET rating = ? WHERE doctor_id = ?',
      [avgResult[0].avg_rating, req.params.id]
    );
    
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add store feedback
router.post('/stores/:id/feedback', authenticate, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    
    await pool.execute(
      'INSERT INTO reviews (user_id, store_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [req.user.id, req.params.id, rating, reviewText]
    );
    
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
