import mongoose from "mongoose";

// Connect to MongoDB using Mongoose
export const connectDB = async () => {
  try {
    // Attempt to connect using the MONGO_URI from the .env file
    const { connection } = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};
