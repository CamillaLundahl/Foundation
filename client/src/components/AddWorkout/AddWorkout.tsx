import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./AddWorkout.scss";
import type { Exercise, WorkoutExercise } from "../../types";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
  templateData?: { templateExercises: string[]; templateTitle: string } | null;
}

/**
 * AddWorkout Component
 * Handles the logic for logging a new workout session.
 */
function AddWorkout({ onWorkoutAdded, templateData }: AddWorkoutProps) {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [library, setLibrary] = useState<Exercise[]>([]);

  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await api.get("/exercises");
        setLibrary(res.data);
        if (res.data.length > 0) setName(res.data[0].name);
      } catch {
        console.error("Kunde inte hämta biblioteket");
      }
    };
    fetchLibrary();
  }, []);

  // Check if templateData is available. If a user starts a workout, we pre-fill the list
  useEffect(() => {
    if (templateData) {
      setTitle(templateData.templateTitle);
      // REFAKTORERING: Förenklat mappningen genom att returnera objektet direkt
      setExercises(
        templateData.templateExercises.map((exName) => ({
          name: exName,
          sets: 0,
          reps: 0,
          weight: 0,
        })),
      );
    }
  }, [templateData]);

  const updateStagedExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: number,
  ) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) =>
    setExercises(exercises.filter((_, i) => i !== index));

  const addExercise = () => {
    if (name) {
      setExercises([...exercises, { name, sets, reps, weight }]);
      setSets(0);
      setReps(0);
      setWeight(0);
    }
  };

  // Handles the submission of a new workout session.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalExercises =
      name && sets > 0
        ? [...exercises, { name, sets, reps, weight }]
        : exercises;

    if (finalExercises.length === 0) return alert("Lägg till minst en övning!");

    try {
      await api.post("/workouts", { title, exercises: finalExercises });
      setTitle("");
      setExercises([]);
      onWorkoutAdded();
    } catch {
      alert("Kunde inte spara passet.");
    }
  };

  const getIsBW = (exName: string) =>
    library.find((l) => l.name === exName)?.isBodyweight;

  return (
    <form className="add-workout-form" onSubmit={handleSubmit}>
      <h3>Logga nytt pass</h3>
      <input
        className="title-input"
        type="text"
        placeholder="Passets namn"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {exercises.length > 0 && (
        <div className="staged-exercises-list">
          {exercises.map((ex, i) => {
            const isBW = getIsBW(ex.name);
            return (
              <div key={i} className="staged-item-row">
                <span className="ex-name">{ex.name}</span>
                <div className="ex-inputs">
                  <input
                    type="number"
                    placeholder="Set"
                    value={ex.sets || ""}
                    onChange={(e) =>
                      updateStagedExercise(i, "sets", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={ex.reps || ""}
                    onChange={(e) =>
                      updateStagedExercise(i, "reps", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    placeholder={isBW ? "BW" : "kg"}
                    disabled={isBW}
                    value={isBW ? "" : ex.weight || ""}
                    onChange={(e) =>
                      updateStagedExercise(i, "weight", Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExercise(i)}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add extra exercise row */}
      <div className="exercise-inputs-row divider">
        <p>Lägg till extra övning:</p>
        <div className="row-content">
          <select
            className="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            {library.map((ex) => (
              <option key={ex._id} value={ex.name}>
                {ex.name} {ex.isBodyweight ? "(BW)" : ""}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Set"
            value={sets || ""}
            onChange={(e) => setSets(Number(e.target.value))}
            className="input-small"
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps || ""}
            onChange={(e) => setReps(Number(e.target.value))}
            className="input-small"
          />
          <input
            type="number"
            placeholder={getIsBW(name) ? "BW" : "kg"}
            disabled={getIsBW(name)}
            value={weight || ""}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="input-small"
          />
        </div>
      </div>

      <button type="button" className="add-exercise-btn" onClick={addExercise}>
        + Lägg till i listan
      </button>
      <button type="submit" className="save-workout-btn">
        Spara hela träningspasset
      </button>
    </form>
  );
}

export default AddWorkout;
