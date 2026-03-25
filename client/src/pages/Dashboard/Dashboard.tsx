import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AddWorkout from "../../components/AddWorkout/AddWorkout";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import "./Dashboard.scss";

/**
 * Dashboard Component
 * The main hub for authenticated users. Displays workout history, 
 * training streaks, and provides the interface for logging new sessions.
 */
function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  // Pagination states to handle large amounts of workout data
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const username = localStorage.getItem("user") || "Användare";
  const location = useLocation();
  const templateData = location.state as any;

  const fetchDashboardData = async (pageNumber: number) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [workoutsRes, statsRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/workouts?page=${pageNumber}&limit=5`,
          config,
        ),
        axios.get(`http://localhost:5000/api/workouts/stats`, config),
      ]);

      setWorkouts(workoutsRes.data.workouts);
      setTotalPages(workoutsRes.data.totalPages);
      setPage(workoutsRes.data.currentPage);
      setStreak(statsRes.data.streak);
    } catch {
      console.error("Kunde inte hämta data");
    }
  };

  // Re-fetch data whenever the page number changes
  useEffect(() => {
    fetchDashboardData(page);
  }, [page]);

  // Handles the deletion of a workout session.
  const handleDelete = async (id: string) => {
    if (window.confirm("Vill du verkligen ta bort detta pass?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refresh the current page to reflect changes
        fetchDashboardData(page);
      } catch {
        alert("Kunde inte radera passet");
      }
    }
  };

  // Updating an existing workout session.
  const handleUpdate = async (id: string, updatedData: any) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/workouts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboardData(page);
    } catch {
      alert("Kunde inte uppdatera passet");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-row">
          <h1>Hej {username}!</h1>
          {streak > 0 && (
            <div className="streak-badge" title="Antal dagar i rad du tränat">
              🔥 <span>{streak}</span>
            </div>
          )}
        </div>
      </header>

      <AddWorkout
        onWorkoutAdded={() => fetchDashboardData(1)}
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

        {/* PAGINATION CONTROLS: Only visible if there are multiple pages */}
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
