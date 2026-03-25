import mongoose from 'mongoose';

/**
 * User Schema
 * Defines the database structure for user accounts.
 */
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Ensure usernames are unique
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
