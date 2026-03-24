import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import programRoutes from "./routes/programRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/programs", programRoutes);

app.get("/", (req, res) => {
  res.send("Foundation API rullar!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});
