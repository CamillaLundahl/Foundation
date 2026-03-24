import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AddWorkout from "../../components/AddWorkout/AddWorkout";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import "./Dashboard.scss";

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
  const username = localStorage.getItem("user") || "Användare";
  const location = useLocation();

  const templateData = location.state as {
    templateExercises: string[];
    templateTitle: string;
  } | null;

  const fetchWorkouts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(res.data);
    } catch {
      console.error("Kunde inte hämta pass");
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Vill du verkligen ta bort detta pass?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchWorkouts();
      } catch {
        alert("Kunde inte radera passet");
      }
    }
  };

  const handleUpdate = async (
    id: string,
    updatedData: { title: string; exercises: Exercise[] },
  ) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/workouts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkouts();
    } catch {
      alert("Kunde inte uppdatera passet");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hej {username}!</h1>
      </header>

      <AddWorkout onWorkoutAdded={fetchWorkouts} templateData={templateData} />

      <section className="history-section">
        <h2>Din historik</h2>
        <div className="workout-list">
          {workouts.length === 0 ? (
            <p className="empty-msg">Inga pass loggade än. Kom igång!</p>
          ) : (
            workouts.map((w) => (
              <WorkoutCard
                key={w._id}
                workout={w}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
