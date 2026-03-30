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
    const savedWorkout = await Workout.create({
      user: req.user.id,
      title,
      exercises,
    });
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte spara träningspasset" });
  }
};

// Retrive paginated list of workouts for the user
export const getWorkouts = async (req: any, res: Response) => {
  try {
    const { page: qPage, limit: qLimit } = req.query;
    const page = parseInt(qPage as string) || 1;
    const limit = parseInt(qLimit as string) || 5;
    const skip = (page - 1) * limit;

    const [workouts, totalWorkouts] = await Promise.all([
      Workout.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Workout.countDocuments({ user: req.user.id }),
    ]);

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

    const totalVolume = workouts.reduce(
      (acc, w) =>
        acc +
        w.exercises.reduce(
          (exAcc, ex) => exAcc + ex.weight * ex.reps * ex.sets,
          0,
        ),
      0,
    );

    // Streak calculation, get all unique dates the user has worked out
    const uniqueDates = [
      ...new Set(workouts.map((w) => new Date(w.createdAt).toDateString())),
    ];

    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const diffDays = Math.ceil(
            Math.abs(
              new Date(uniqueDates[i]).getTime() -
                new Date(uniqueDates[i + 1]).getTime(),
            ) /
              (1000 * 60 * 60 * 24),
          );
          if (diffDays === 1) streak++;
          else break;
        }
      }
    }

    res.status(200).json({
      totalWorkouts: workouts.length,
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
    const [workouts, exerciseLibrary] = await Promise.all([
      Workout.find({ user: req.user.id }),
      Exercise.find(),
    ]);

    const bodyweightMap = exerciseLibrary.reduce((map: any, ex) => {
      map[ex.name] = ex.isBodyweight;
      return map;
    }, {});

    const prs: { [key: string]: { value: number; isBodyweight: boolean } } = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        const isBW = bodyweightMap[ex.name] || false;
        const currentValue = isBW ? ex.reps * ex.sets : ex.weight;

        if (!prs[ex.name] || currentValue > prs[ex.name].value) {
          prs[ex.name] = { value: currentValue, isBodyweight: isBW };
        }
      });
    });

    // Sort the personal records in descending order
    const prArray = Object.entries(prs)
      .map(([name, data]) => ({ name, ...data }))
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
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, exercises },
      { new: true },
    );

    if (!workout) {
      return res
        .status(404)
        .json({ message: "Passet hittades inte eller ej behörig" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: "Serverfel: Kunde inte uppdatera" });
  }
};

// Delete a workout session
export const deleteWorkout = async (req: any, res: Response) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res
        .status(404)
        .json({ message: "Träningspasset hittades inte eller ej behörig" });
    }

    res.status(200).json({ message: "Träningspasset raderat" });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte radera träningspasset" });
  }
};
