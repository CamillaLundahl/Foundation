import { Request, Response } from "express";
import Workout from "../models/Workout";
import Exercise from "../models/Exercises";

/**
 * Workout Controller
 * Manages all CRUD operations for user workouts, including statistics 
 * and personal record calculations.
 */
export const createWorkout = async (req: any, res: Response) => {
  try {
    const { title, exercises } = req.body;
    const newWorkout = new Workout({
      user: req.user.id,
      title,
      exercises,
    });
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte spara träningspasset" });
  }
};

// Retrive paginated list of workouts for the user
export const getWorkouts = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const workouts = await Workout.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalWorkouts = await Workout.countDocuments({ user: req.user.id });

    res.json({
      workouts,
      totalPages: Math.ceil(totalWorkouts / limit),
      currentPage: page,
      totalWorkouts,
    });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta träningspass" });
  }
};

// Calculate and return workout statistics, total workouts, total volume, and longest streak
export const getWorkoutStats = async (req: any, res: Response) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const totalWorkouts = workouts.length;
    let totalVolume = 0;

    // Streak calculation, get all unique dates the user has worked out
    const workoutDates = workouts.map((w) =>
      new Date(w.createdAt).toDateString(),
    );
    const uniqueDates = [...new Set(workoutDates)];

    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      // Check if the first date is today or yesterday
      if (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr) {
        streak = 1;
        // Check if the last date is today
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = new Date(uniqueDates[i]);
          const next = new Date(uniqueDates[i + 1]);
          const diffTime = Math.abs(current.getTime() - next.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break; // Break the loop if the dates are not consecutive
          }
        }
      }
    }

    // Calculate total volume
    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        totalVolume += ex.weight * ex.reps * ex.sets;
      });
    });

    res.status(200).json({
      totalWorkouts,
      totalVolume,
      streak,
    });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta statistik" });
  }
};

// Calculate and return personal records for each exercise
export const getPersonalRecords = async (req: any, res: Response) => {
  try {
    const workouts = await Workout.find({ user: req.user.id });
    const exerciseLibrary = await Exercise.find();

    // Create a map of exercise names and whether they are bodyweight
    const bodyweightMap: { [key: string]: boolean } = {};
    exerciseLibrary.forEach((ex) => {
      bodyweightMap[ex.name] = ex.isBodyweight;
    });

    const prs: { [key: string]: { value: number; isBodyweight: boolean } } = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        const isBW = bodyweightMap[ex.name] || false;

        // Calculate the current value for the exercise, either reps*sets or weight
        const currentValue = isBW ? ex.reps * ex.sets : ex.weight;

        if (!prs[ex.name] || currentValue > prs[ex.name].value) {
          prs[ex.name] = {
            value: currentValue,
            isBodyweight: isBW,
          };
        }
      });
    });

    // Sort the personal records in descending order
    const prArray = Object.keys(prs)
      .map((name) => ({
        name,
        value: prs[name].value,
        isBodyweight: prs[name].isBodyweight,
      }))
      .sort((a, b) => b.value - a.value);

    res.status(200).json(prArray);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta personliga rekord" });
  }
};

// Update an existing workout
export const updateWorkout = async (req: any, res: Response) => {
  try {
    const { title, exercises } = req.body;
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Passet hittades inte" });
    }

    // Check if the user is authorized
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Ej behörig" });
    }

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { title, exercises },
      { new: true },
    );

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: "Serverfel: Kunde inte uppdatera" });
  }
};

// Delete a workout session
export const deleteWorkout = async (req: any, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Träningspasset hittades inte" });
    }
    // Check if the user is authorized
    if (workout.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Ej behörig att radera detta pass" });
    }
    await workout.deleteOne();
    res.status(200).json({ message: "Träningspasset raderat" });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte radera träningspasset" });
  }
};
