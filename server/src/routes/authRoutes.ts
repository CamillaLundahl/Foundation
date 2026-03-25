import express from 'express';
import { register, login } from '../controllers/authController';


/**
 * Authentication Routes
 * This router handles all endpoints related to user identity and session management.
 */
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
