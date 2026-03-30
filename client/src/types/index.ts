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

interface BaseEntity {
  _id: string;
  title: string;
}

export interface Workout extends BaseEntity {
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface Program extends BaseEntity {
  exercises: string[];
}

export interface PersonalRecord {
  name: string;
  value: number;
  isBodyweight: boolean;
}
