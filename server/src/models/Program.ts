import mongoose, { Schema, Document } from "mongoose";

/**
 * IProgram Interface
 * Workout programs act as templates that users can reuse to start new sessions.
 */
export interface IProgram extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  exercises: string[];
}

// Define the structure of a program collection in the database
const ProgramSchema: Schema = new Schema(
  {
    // Ensure users only have access to their own programs
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Array of exercise names
    exercises: [
      {
        type: String,
        required: true,
      },
    ],
  },
  // Automatically create createdAt and updatedAt fields
  { timestamps: true },
);

// Export the model for use in controllers
export default mongoose.model<IProgram>("Program", ProgramSchema);
