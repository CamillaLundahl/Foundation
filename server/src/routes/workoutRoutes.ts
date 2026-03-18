import express from 'express';
import { createWorkout, getWorkouts, deleteWorkout } from '../controllers/workoutController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createWorkout);
router.get('/', protect, getWorkouts);
router.delete('/:id', protect, deleteWorkout);

export default router;
