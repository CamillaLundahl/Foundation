import { useState, useEffect } from "react";
import axios from "axios";
import "./AddWorkout.scss";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

function AddWorkout({ onWorkoutAdded }: AddWorkoutProps) {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [library, setLibrary] = useState<any[]>([]);
  
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/exercises");
        setLibrary(res.data);
        if (res.data.length > 0) setName(res.data[0].name);
      } catch {
        console.error("Kunde inte hämta biblioteket");
      }
    };
    fetchLibrary();
  }, []);

  const addExercise = () => {
    if (name && sets > 0) {
      setExercises([...exercises, { name, sets, reps, weight }]);
      setSets(0); setReps(0); setWeight(0);
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
      setSets(0); setReps(0); setWeight(0);
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
        <select
          className="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        >
          {library.length === 0 && <option value="">Skapa övningar först...</option>}
          {library.map((ex) => (
            <option key={ex._id} value={ex.name}>
              {ex.name}
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
