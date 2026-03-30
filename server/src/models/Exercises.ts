import mongoose, { Schema, Document } from "mongoose";

/**
 * IExercise Interface
 * Defines the TypeScript structure for an Exercise document.
 */
export interface IExercise extends Document {
  name: string;
  muscleGroup: string;
  isBodyweight: boolean;
}

// Exercise Schema, defines the structure of an exercise collection in the database
const ExerciseSchema = new Schema({
  // Required fields
  name: { type: String, required: true, unique: true },
  muscleGroup: { type: String, required: true },
  // Default is false, if true, the exercise is bodyweight
  isBodyweight: { type: Boolean, default: false },
});

// Export the model to be used in controllers for CRUD operations
export default mongoose.model<IExercise>("Exercise", ExerciseSchema);
