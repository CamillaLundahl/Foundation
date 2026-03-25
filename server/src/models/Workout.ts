import mongoose, { Schema, Document } from "mongoose";

/**
 * IWorkout Interface
 * Defines the structure of a logged workout session.
 * This document stores the historical data of a completed training session.
 */
export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user who logged the workout
  title: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the structure of a workout collection in the database
const WorkoutSchema: Schema = new Schema(
  {
    // Ensure users only have access to their own workouts
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Array of exercise objects
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IWorkout>("Workout", WorkoutSchema);
