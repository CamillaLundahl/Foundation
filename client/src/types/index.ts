export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  isBodyweight: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  _id: string;
  title: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface Program {
  _id: string;
  title: string;
  exercises: string[];
}

export interface PersonalRecord {
  name: string;
  value: number;
  isBodyweight: boolean;
}
