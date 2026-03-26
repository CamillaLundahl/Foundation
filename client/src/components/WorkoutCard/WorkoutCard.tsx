import { useState } from "react";
import "./WorkoutCard.scss";
import type { Workout, WorkoutExercise } from "../../types";

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    updatedData: { title: string; exercises: WorkoutExercise[] },
  ) => void;
}

/**
 * WorkoutCard Component
 * Displays a single workout session with the ability to toggle into an edit mode.
 */
function WorkoutCard({ workout, onDelete, onUpdate }: WorkoutCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(workout.title);
  const [editExercises, setEditExercises] = useState([...workout.exercises]);

  const handleExerciseChange = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number,
  ) => {
    const updated = [...editExercises];
    const finalValue = field === "name" ? value : Number(value);

    updated[index] = { ...updated[index], [field]: finalValue };
    setEditExercises(updated);
  };

  // Triggers the onUpdate callback provided by the parent component and exits edit mode.
  const handleSave = () => {
    onUpdate(workout._id, { title: editTitle, exercises: editExercises });
    setIsEditing(false);
  };

  // Displays either the original data or the edited data depending on the current state.
  const displayExercises = isEditing ? editExercises : workout.exercises;

  return (
    <div className="workout-card">
      <div className="card-header">
        {isEditing ? (
          <input
            className="edit-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h3>{workout.title}</h3>
        )}

        <div className="card-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Spara
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Avbryt
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Ändra
              </button>
              <button
                onClick={() => onDelete(workout._id)}
                className="delete-button"
              >
                Radera
              </button>
            </>
          )}
        </div>
      </div>

      <span className="workout-date">
        {new Date(workout.createdAt).toLocaleDateString()}
      </span>

      {/* Exercise list */}
      <ul className="exercise-list">
        {displayExercises.map((ex, i) => (
          <li key={i} className={isEditing ? "edit-row" : ""}>
            {isEditing ? (
              <div className="edit-exercise-inputs">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) =>
                    handleExerciseChange(i, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) =>
                    handleExerciseChange(i, "sets", e.target.value)
                  }
                />
                <span>x</span>
                <input
                  type="number"
                  value={ex.reps}
                  onChange={(e) =>
                    handleExerciseChange(i, "reps", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={ex.weight}
                  onChange={(e) =>
                    handleExerciseChange(i, "weight", e.target.value)
                  }
                />
                <span>kg</span>
              </div>
            ) : (
              <p>
                <strong>{ex.name}:</strong> {ex.sets}x{ex.reps} — {ex.weight}kg
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkoutCard;
