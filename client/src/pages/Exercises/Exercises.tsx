import { useEffect, useState } from "react";
import axios from "axios";
import "./Exercises.scss";

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
}

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newName, setNewName] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState("Ben");

  const fetchExercises = async () => {
    const res = await axios.get("http://localhost:5000/api/exercises");
    setExercises(res.data);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/exercises", {
        name: newName,
        muscleGroup: newMuscleGroup,
      });
      setNewName("");
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
          placeholder="Övningsnamn"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <select
          value={newMuscleGroup}
          onChange={(e) => setNewMuscleGroup(e.target.value)}
        >
          <option value="Ben">Ben</option>
          <option value="Rygg">Rygg</option>
          <option value="Bröst">Bröst</option>
          <option value="Axlar">Axlar</option>
          <option value="Armar">Armar</option>
          <option value="Mage">Mage</option>
        </select>
        <button type="submit">Skapa övning</button>
      </form>

      <div className="exercise-grid">
        {exercises.map((ex) => (
          <div key={ex._id} className="exercise-card">
            <h3>{ex.name}</h3>
            <span className="badge">{ex.muscleGroup}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercises;
