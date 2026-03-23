import express from 'express';
import Exercise from '../models/Exercises';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte hämta övningar' });
  }
});

router.post('/', async (req, res) => {
  const { name, muscleGroup } = req.body;
  try {
    const newExercise = new Exercise({ name, muscleGroup });
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: 'Övningen finns redan eller felaktig data' });
  }
});

export default router;
