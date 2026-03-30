import { Router } from "express";
import Exercise from "../models/Exercises";

/**
 * Exercise Routes
 * This router manages the global library of exercises available to all users.
 */
const router = Router();

// Get all exercises and sorted alphabetically
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises);
  } catch {
    res.status(500).json({ message: "Kunde inte hämta övningar" });
  }
});

// Create a new exercise and receive name, muscleGroup and isBodyweight
router.post("/", async (req, res) => {
  const { name, muscleGroup, isBodyweight } = req.body;
  try {
    const newExercise = await Exercise.create({
      name,
      muscleGroup,
      isBodyweight,
    });

    res.status(201).json(newExercise);
  } catch {
    res
      .status(400)
      .json({ message: "Övningen finns redan eller felaktig data" });
  }
});

export default router;
