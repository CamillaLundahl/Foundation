import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}

const WorkoutSchema: Schema = new Schema({
  // Kopplar passet till användarens unika ID
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
