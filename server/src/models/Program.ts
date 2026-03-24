import mongoose, { Schema, Document } from "mongoose";

export interface IProgram extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  exercises: string[];
}

const ProgramSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    exercises: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IProgram>("Program", ProgramSchema);
