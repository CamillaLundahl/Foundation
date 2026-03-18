import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddWorkout from '../../components/AddWorkout';
import './Dashboard.scss';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('user') || 'Användare';

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(res.data);
    } catch (err) {
      console.error('Kunde inte hämta pass');
    }
  };

  // NY FUNKTION: Radera pass
  const handleDelete = async (id: string) => {
    if (window.confirm('Vill du verkligen ta bort detta pass?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchWorkouts(); // Uppdatera listan direkt
      } catch (err) {
        alert('Kunde inte radera passet');
      }
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hej {username}!</h1>
        <button onClick={handleLogout} className="logout-button">Logga ut</button>
      </header>

      <AddWorkout onWorkoutAdded={fetchWorkouts} />

      <section className="history-section">
        <h2>Din historik</h2>
        <div className="workout-list">
          {workouts.map((w: any) => (
            <div key={w._id} className="workout-card">
              <div className="card-header">
                <h3>{w.title}</h3>
                {/* NY KNAPP: Radera */}
                <button onClick={() => handleDelete(w._id)} className="delete-button">
                  Radera
                </button>
              </div>
              <span className="workout-date">{new Date(w.createdAt).toLocaleDateString()}</span>
              <ul>
                {w.exercises.map((ex: any, i: number) => (
                  <li key={i}>
                    <strong>{ex.name}:</strong> {ex.sets}x{ex.reps} — {ex.weight}kg
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
