import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Exercises.scss";

const MUSCLE_GROUPS = ["Ben", "Rygg", "Bröst", "Axlar", "Armar", "Mage"];

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  isBodyweight: boolean;
}

/**
 * Exercises Component
 * Manages the global exercise library where users can view existing exercises
 * and add new ones to the database.
 */
function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Ben");
  const [isBodyweight, setIsBodyweight] = useState(false); // Toggle for bodyweight-only exercises

  // Fetches all exercises from the backend library.
  const fetchExercises = async () => {
    try {
      const { data } = await api.get("/exercises");
      setExercises(data);
    } catch (err) {
      console.error("Kunde inte hämta övningar");
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // Handles the submission of a new exercise.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/exercises", {
        name,
        muscleGroup,
        isBodyweight,
      });
      // Reset form fields on success
      setName("");
      setIsBodyweight(false);
      // Refresh the exercise library
      fetchExercises();
    } catch {
      alert("Fel vid sparning");
    }
  };

  return (
    <div className="exercises-container">
      <h1>Övningsbibliotek</h1>

      {/* Create new exercise */}
      <form onSubmit={handleSubmit} className="add-exercise-form">
        <input
          type="text"
          placeholder="Övningsnamn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          {MUSCLE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        {/* Checkbox to define if the exercise should be tracked via Reps instead of Weight */}
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={isBodyweight}
            onChange={(e) => setIsBodyweight(e.target.checked)}
          />
          Kroppsvikt
        </label>

        <button type="submit">Skapa övning</button>
      </form>

      <div className="exercise-grid">
        {exercises.map((ex) => (
          <div key={ex._id} className="exercise-card">
            <h3>{ex.name}</h3>
            <div className="badge-row">
              <span className="badge">{ex.muscleGroup}</span>
              {ex.isBodyweight && <span className="badge bw">Kroppsvikt</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercises;
