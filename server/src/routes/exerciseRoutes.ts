import express from "express";
import Exercise from "../models/Exercises";

/**
 * Exercise Routes
 * This router manages the global library of exercises available to all users.
 */
const router = express.Router();

// Get all exercises and sorted alphabetically
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta övningar" });
  }
});

// Create a new exercise and receive name, muscleGroup and isBodyweight
router.post("/", async (req, res) => {
  const { name, muscleGroup, isBodyweight } = req.body;
  try {
    const newExercise = new Exercise({ 
      name, 
      muscleGroup, 
      isBodyweight: isBodyweight || false // Set isBodyweight to false if not provided
    });
    
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Övningen finns redan eller felaktig data" });
  }
});

export default router;
