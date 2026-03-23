import { useState } from "react";
import axios from "axios";
import "./AddWorkout.scss";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

function AddWorkout({ onWorkoutAdded }: AddWorkoutProps) {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const addExercise = () => {
    if (name && sets > 0) {
      setExercises([...exercises, { name, sets, reps, weight }]);
      setName(""); setSets(0); setReps(0); setWeight(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const finalExercises = name ? [...exercises, { name, sets, reps, weight }] : exercises;

    if (finalExercises.length === 0) {
      alert("Lägg till minst en övning!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/workouts",
        { title, exercises: finalExercises },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTitle("");
      setExercises([]);
      setName(""); setSets(0); setReps(0); setWeight(0);
      onWorkoutAdded();
    } catch {
      alert("Kunde inte spara passet. Kontrollera anslutningen.");
    }
  };

  return (
    <form className="add-workout-form" onSubmit={handleSubmit}>
      <h3>Logga nytt pass</h3>
      <input
        className="title-input"
        type="text"
        placeholder="Passets namn (t.ex. Överkropp)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {exercises.length > 0 && (
        <div className="staged-exercises-list">
          {exercises.map((ex, i) => (
            <div key={i} className="staged-item">
              <strong>{ex.name}</strong>: {ex.sets}x{ex.reps} — {ex.weight}kg
            </div>
          ))}
        </div>
      )}

      <div className="exercise-inputs-row">
        <input
          type="text"
          placeholder="Övning"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-name"
        />
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
          placeholder="kg"
          value={weight || ""}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="input-small"
        />
      </div>

      <button type="button" className="add-exercise-btn" onClick={addExercise}>
        + Lägg till övning i passet
      </button>

      <button type="submit" className="save-workout-btn">
        Spara hela träningspasset
      </button>
    </form>
  );
}

export default AddWorkout;
