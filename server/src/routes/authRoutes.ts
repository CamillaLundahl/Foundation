import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Dessa adresser läggs till efter /api/auth
router.post('/register', register);
router.post('/login', login);

export default router;
