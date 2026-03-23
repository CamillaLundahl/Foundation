import express from 'express';
import Program from '../models/Program';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, async (req: any, res) => {
  try {
    const programs = await Program.find({ user: req.user.id });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte hämta program' });
  }
});

router.post('/', protect, async (req: any, res) => {
  const { title, exercises } = req.body;
  try {
    const newProgram = new Program({
      user: req.user.id,
      title,
      exercises
    });
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ message: 'Kunde inte skapa programmet' });
  }
});

router.put('/:id', protect, async (req: any, res) => {
  const { title, exercises } = req.body;
  try {
    const updatedProgram = await Program.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, exercises },
      { new: true }
    );
    if (!updatedProgram) return res.status(404).json({ message: 'Programmet hittades inte' });
    res.json(updatedProgram);
  } catch (err) {
    res.status(400).json({ message: 'Kunde inte uppdatera programmet' });
  }
});

router.delete('/:id', protect, async (req: any, res) => {
  try {
    const deleted = await Program.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!deleted) return res.status(404).json({ message: 'Hittades inte' });
    res.json({ message: 'Raderat' });
  } catch (err) {
    res.status(500).json({ message: 'Serverfel vid radering' });
  }
});

export default router;
