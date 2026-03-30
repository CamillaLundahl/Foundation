import mongoose, { Schema, model } from "mongoose";

/**
 * User Schema
 * Defines the database structure for user accounts.
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("User", UserSchema);
