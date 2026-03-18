import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes'; // Importera dina routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Koppla in inloggnings-rutterna
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Foundation API rullar!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});
