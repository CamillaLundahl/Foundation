import { Router } from "express";
import Program from "../models/Program";
import { protect } from "../middleware/authMiddleware";

/**
 * Program Routes
 * This router handles the CRUD operations for workout templates (Programs).
 */
const router = Router();

// Get all programs
router.get("/", protect, async (req: any, res) => {
  try {
    // Find all programs created by the authenticated user
    const programs = await Program.find({ user: req.user.id });
    res.json(programs);
  } catch {
    res.status(500).json({ message: "Kunde inte hämta program" });
  }
});

// Create a new program
router.post("/", protect, async (req: any, res) => {
  const { title, exercises } = req.body;
  try {
    // Create a new program instance linked to the authenticated user
    const newProgram = await Program.create({
      user: req.user.id,
      title,
      exercises,
    });
    res.status(201).json(newProgram);
  } catch {
    // REFAKTORERING: Tog bort oanvänd 'err'
    res.status(400).json({ message: "Kunde inte skapa programmet" });
  }
});

// Update an existing program
router.put("/:id", protect, async (req: any, res) => {
  const { title, exercises } = req.body;
  const { id } = req.params;
  try {
    // Find the program by ID and update it
    const updatedProgram = await Program.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, exercises },
      { new: true }, // Return the updated document
    );
    if (!updatedProgram)
      return res.status(404).json({ message: "Programmet hittades inte" });
    res.json(updatedProgram);
  } catch {
    res.status(400).json({ message: "Kunde inte uppdatera programmet" });
  }
});

// Delete a program
router.delete("/:id", protect, async (req: any, res) => {
  const { id } = req.params;
  try {
    // Ensure the program exists and belongs to the authenticated user
    const deleted = await Program.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Hittades inte" });
    res.json({ message: "Raderat" });
  } catch {
    res.status(500).json({ message: "Serverfel vid radering" });
  }
});

export default router;
