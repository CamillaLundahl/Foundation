import { useEffect, useState } from "react";
import axios from "axios";
import "./Exercises.scss";

const MUSCLE_GROUPS = ["Ben", "Rygg", "Bröst", "Axlar", "Armar", "Mage"];

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  isBodyweight: boolean;
}

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Ben");
  const [isBodyweight, setIsBodyweight] = useState(false);

  const fetchExercises = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/exercises");
      setExercises(data);
    } catch (err) {
      console.error("Kunde inte hämta övningar");
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/exercises", {
        name,
        muscleGroup,
        isBodyweight,
      });
      setName("");
      setIsBodyweight(false);
      fetchExercises();
    } catch {
      alert("Fel vid sparning");
    }
  };

  return (
    <div className="exercises-container">
      <h1>Övningsbibliotek</h1>

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
