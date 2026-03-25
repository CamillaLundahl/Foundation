import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import programRoutes from "./routes/programRoutes";

/**
 * Main Server Entry Point
 * This file initializes the Express application, connects to the database,
 * configures middleware, and defines the primary API routes.
 */
dotenv.config();
connectDB();

const app = express();

// Middleware, enables CORS and JSON parsing
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/programs", programRoutes);

app.get("/", (req, res) => {
  res.send("Foundation API rullar!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});
