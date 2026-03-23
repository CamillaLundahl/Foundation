import { useState } from "react";
import axios from "axios";
import "./AddWorkout.scss";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

function AddWorkout({ onWorkoutAdded }: AddWorkoutProps) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Du måste vara inloggad för att spara pass!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/workouts",
        {
          title,
          exercises: [{ name, sets, reps, weight }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTitle("");
      setName("");
      setSets(0);
      setReps(0);
      setWeight(0);

      onWorkoutAdded();
    } catch (err) {
      console.error("Kunde inte spara:", err);
    }
  };

  return (
    <form className="add-workout-form" onSubmit={handleSubmit}>
      <h3>Logga nytt pass</h3>
      <input
        className="title-input"
        type="text"
        placeholder="Passets namn (t.ex. Benpass)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="exercise-inputs-row">
        <input
          type="text"
          placeholder="Övning"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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

      <button type="submit" className="save-workout-btn">
        Spara träningspass
      </button>
    </form>
  );
}

export default AddWorkout;
