import { useState, useEffect } from "react";
import axios from "axios";
import "./AddWorkout.scss";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
  templateData?: { templateExercises: string[], templateTitle: string } | null;
}

function AddWorkout({ onWorkoutAdded, templateData }: AddWorkoutProps) {
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

  useEffect(() => {
    if (templateData) {
      setTitle(templateData.templateTitle);
      const preparedExercises = templateData.templateExercises.map(exName => ({
        name: exName,
        sets: 0,
        reps: 0,
        weight: 0
      }));
      setExercises(preparedExercises);
    }
  }, [templateData]);

  const updateStagedExercise = (index: number, field: string, value: number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    if (name) {
      setExercises([...exercises, { name, sets, reps, weight }]);
      setSets(0); setReps(0); setWeight(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const finalExercises = name && sets > 0 ? [...exercises, { name, sets, reps, weight }] : exercises;

    if (finalExercises.length === 0) return alert("Lägg till minst en övning!");

    try {
      await axios.post("http://localhost:5000/api/workouts",
        { title, exercises: finalExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setExercises([]);
      onWorkoutAdded();
    } catch {
      alert("Kunde inte spara passet.");
    }
  };

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
          {exercises.map((ex, i) => (
            <div key={i} className="staged-item-row">
              <span className="ex-name">{ex.name}</span>
              <div className="ex-inputs">
                <input type="number" placeholder="Set" value={ex.sets || ""} onChange={e => updateStagedExercise(i, 'sets', Number(e.target.value))} />
                <input type="number" placeholder="Reps" value={ex.reps || ""} onChange={e => updateStagedExercise(i, 'reps', Number(e.target.value))} />
                <input type="number" placeholder="kg" value={ex.weight || ""} onChange={e => updateStagedExercise(i, 'weight', Number(e.target.value))} />
                <button type="button" className="remove-btn" onClick={() => removeExercise(i)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="exercise-inputs-row divider">
        <p>Lägg till extra övning:</p>
        <div className="row-content">
          <select className="input-name" value={name} onChange={(e) => setName(e.target.value)}>
            {library.map((ex) => (
              <option key={ex._id} value={ex.name}>{ex.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Set" value={sets || ""} onChange={e => setSets(Number(e.target.value))} className="input-small" />
          <input type="number" placeholder="Reps" value={reps || ""} onChange={e => setReps(Number(e.target.value))} className="input-small" />
          <input type="number" placeholder="kg" value={weight || ""} onChange={e => setWeight(Number(e.target.value))} className="input-small" />
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
