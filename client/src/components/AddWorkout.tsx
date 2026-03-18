import { useState } from 'react';
import axios from 'axios';

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

function AddWorkout({ onWorkoutAdded }: AddWorkoutProps) {
  const [title, setTitle] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/workouts', 
        {
          title,
          exercises: [{ name: exerciseName, sets, reps, weight }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTitle('');
      setExerciseName('');
      onWorkoutAdded();
    } catch (err) {
      alert('Kunde inte spara passet');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Logga nytt pass</h3>
      <input type="text" placeholder="Passets namn" value={title} onChange={(e) => setTitle(e.target.value)} required /><br /><br />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Övning" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required />
        <input type="number" placeholder="Set" onChange={(e) => setSets(Number(e.target.value))} style={{ width: '50px' }} />
        <input type="number" placeholder="Reps" onChange={(e) => setReps(Number(e.target.value))} style={{ width: '50px' }} />
        <input type="number" placeholder="kg" onChange={(e) => setWeight(Number(e.target.value))} style={{ width: '50px' }} />
      </div>
      
      <button type="submit" style={{ marginTop: '15px', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
        Spara träningspass
      </button>
    </form>
  );
}

export default AddWorkout;
