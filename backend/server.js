import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import symptomsRoutes from './routes/symptoms.js';
import storesRoutes from './routes/stores.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import reviewsRoutes from './routes/reviews.js';
import medicinesRoutes from './routes/medicines.js';
import historyRoutes from './routes/history.js';
import doctorsRoutes from './routes/doctors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api', doctorsRoutes); // For /api/consultations

app.get('/', (req, res) => {
  res.json({ message: 'Healthcare Bot API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
