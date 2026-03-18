import { Request, Response } from "express";
import Workout from "../models/Workout";

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

export const getWorkouts = async (req: any, res: Response) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta träningspassen" });
  }
};

export const updateWorkout = async (req: any, res: Response) => {
  try {
    const { title, exercises } = req.body;
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Passet hittades inte" });
    }

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

export const deleteWorkout = async (req: any, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Träningspasset hittades inte" });
    }

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
