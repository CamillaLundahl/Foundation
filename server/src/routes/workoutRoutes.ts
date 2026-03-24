import express from "express";
import {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  getWorkoutStats,
  getPersonalRecords,
} from "../controllers/workoutController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/stats", protect, getWorkoutStats);
router.get("/prs", protect, getPersonalRecords);
router.delete("/:id", protect, deleteWorkout);
router.put("/:id", protect, updateWorkout);

export default router;
