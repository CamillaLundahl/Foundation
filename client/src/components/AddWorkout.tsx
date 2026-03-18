import { useState } from 'react';
import axios from 'axios';

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

function AddWorkout({ onWorkoutAdded }: AddWorkoutProps) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Du måste vara inloggad för att spara pass!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/workouts', 
        {
          title,
          exercises: [{ name, sets, reps, weight }]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setTitle('');
      setName('');
      setSets(0);
      setReps(0);
      setWeight(0);
      
      onWorkoutAdded();
    } catch (err) {
      console.error('Kunde inte spara:', err);
      alert('Kunde inte spara passet. Kontrollera att servern är igång.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Logga nytt pass</h3>
      <input 
        type="text" 
        placeholder="Passets namn (t.ex. Benpass)" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      /><br />
      
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input type="text" placeholder="Övning" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 2, padding: '8px' }} />
        <input type="number" placeholder="Set" value={sets || ''} onChange={(e) => setSets(Number(e.target.value))} style={{ flex: 1, padding: '8px' }} />
        <input type="number" placeholder="Reps" value={reps || ''} onChange={(e) => setReps(Number(e.target.value))} style={{ flex: 1, padding: '8px' }} />
        <input type="number" placeholder="kg" value={weight || ''} onChange={(e) => setWeight(Number(e.target.value))} style={{ flex: 1, padding: '8px' }} />
      </div>
      
      <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Spara träningspass
      </button>
    </form>
  );
}

export default AddWorkout;
