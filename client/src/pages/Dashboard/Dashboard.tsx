import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AddWorkout from "../../components/AddWorkout/AddWorkout";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import "./Dashboard.scss";

function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const username = localStorage.getItem("user") || "Användare";
  const location = useLocation();
  const templateData = location.state as any;

  const fetchWorkouts = async (pageNumber: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/workouts?page=${pageNumber}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setWorkouts(res.data.workouts);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch {
      console.error("Kunde inte hämta pass");
    }
  };

  useEffect(() => {
    fetchWorkouts(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Vill du verkligen ta bort detta pass?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchWorkouts(page);
      } catch {
        alert("Kunde inte radera passet");
      }
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/workouts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkouts(page);
    } catch {
      alert("Kunde inte uppdatera passet");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hej {username}!</h1>
      </header>

      <AddWorkout
        onWorkoutAdded={() => fetchWorkouts(1)}
        templateData={templateData}
      />

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

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="pag-btn"
            >
              &larr; Föregående
            </button>

            <span className="page-info">
              Sida {page} av {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="pag-btn"
            >
              Nästa &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
