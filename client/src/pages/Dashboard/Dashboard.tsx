import { useEffect, useState } from 'react';
import axios from 'axios';
import AddWorkout from '../../components/AddWorkout/AddWorkout';
import './Dashboard.scss';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  _id: string;
  title: string;
  exercises: Exercise[];
  createdAt: string;
}

function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExercises, setEditExercises] = useState<Exercise[]>([]);
  
  const username = localStorage.getItem('user') || 'Användare';

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(res.data);
    } catch (err) {
      console.error('Kunde inte hämta pass', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Vill du verkligen ta bort detta pass?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchWorkouts();
      } catch (err) {
        alert('Kunde inte radera passet');
      }
    }
  };

  const startEdit = (workout: Workout) => {
    setEditingId(workout._id);
    setEditTitle(workout.title);
    setEditExercises([...workout.exercises]);
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = [...editExercises];
    updatedExercises[index] = { 
      ...updatedExercises[index], 
      [field]: field === 'name' ? value : Number(value) 
    };
    setEditExercises(updatedExercises);
  };

  const handleUpdate = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/workouts/${id}`, 
        { title: editTitle, exercises: editExercises }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchWorkouts();
    } catch (err) {
      alert('Kunde inte uppdatera passet');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hej {username}!</h1>
      </header>

      <AddWorkout onWorkoutAdded={fetchWorkouts} />

      <section className="history-section">
        <h2>Din historik</h2>
        <div className="workout-list">
          {workouts.length === 0 && <p>Inga pass loggade än. Kom igång!</p>}
          
          {workouts.map((w) => (
            <div key={w._id} className="workout-card">
              <div className="card-header">
                {editingId === w._id ? (
                  <input 
                    className="edit-title-input"
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <h3>{w.title}</h3>
                )}
                
                <div className="card-actions">
                  {editingId === w._id ? (
                    <>
                      <button onClick={() => handleUpdate(w._id)} className="save-btn">Spara</button>
                      <button onClick={() => setEditingId(null)} className="cancel-btn">Avbryt</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(w)} className="edit-btn">Ändra</button>
                      <button onClick={() => handleDelete(w._id)} className="delete-button">Radera</button>
                    </>
                  )}
                </div>
              </div>
              
              <span className="workout-date">
                {new Date(w.createdAt).toLocaleDateString()}
              </span>

              <ul className="exercise-list">
                {(editingId === w._id ? editExercises : w.exercises).map((ex, i) => (
                  <li key={i} className={editingId === w._id ? 'edit-row' : ''}>
                    {editingId === w._id ? (
                      <div className="edit-exercise-inputs">
                        <input type="text" value={ex.name} onChange={(e) => handleExerciseChange(i, 'name', e.target.value)} />
                        <input type="number" value={ex.sets} onChange={(e) => handleExerciseChange(i, 'sets', e.target.value)} />
                        <span>x</span>
                        <input type="number" value={ex.reps} onChange={(e) => handleExerciseChange(i, 'reps', e.target.value)} />
                        <input type="number" value={ex.weight} onChange={(e) => handleExerciseChange(i, 'weight', e.target.value)} />
                        <span>kg</span>
                      </div>
                    ) : (
                      <p><strong>{ex.name}:</strong> {ex.sets}x{ex.reps} — {ex.weight}kg</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
