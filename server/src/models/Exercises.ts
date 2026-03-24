import mongoose, { Schema, Document } from "mongoose";

export interface IExercise extends Document {
  name: string;
  muscleGroup: string;
  isBodyweight: boolean;
}

const ExerciseSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  muscleGroup: { type: String, required: true },
  isBodyweight: { type: Boolean, default: false },
});

export default mongoose.model<IExercise>("Exercise", ExerciseSchema);
