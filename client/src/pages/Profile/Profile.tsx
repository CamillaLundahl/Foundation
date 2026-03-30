import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Profile.scss";
import type { PersonalRecord } from "../../types";

/**
 * Profile Component
 * Displays the user's personal training statistics, including total workouts,
 * training volume, current streak, and personal records (PRs).
 */
function Profile() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    streak: 0,
  });
  // List of personal records for various exercises
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const username = localStorage.getItem("user");

  useEffect(() => {
    // Fetches user-specific statistics and personal records from the API.
    const fetchData = async () => {
      try {
        // Concurrent API calls to retrieve stats and PRs
        const [{ data: statsData }, { data: prData }] = await Promise.all([
          api.get("/workouts/stats"),
          api.get("/workouts/prs"),
        ]);

        // Update local state with the retrieved data
        setStats(statsData);
        setRecords(prData);
      } catch {
        console.error("Kunde inte hämta profildata");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="profile-container">
      <div className="user-info">
        <div className="avatar">{username?.[0].toUpperCase()}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Totalt antal pass</span>
          <strong>{stats.totalWorkouts} st</strong>
        </div>
        <div className="stat-card streak-card">
          <span>Nuvarande Streak</span>
          <strong>🔥 {stats.streak} dagar</strong>
        </div>
        <div className="stat-card">
          <span>Total volym lyft</span>
          <strong>{stats.totalVolume.toLocaleString()} kg</strong>
        </div>
      </div>

      <div className="pr-section">
        <h3>Personliga Rekord</h3>
        <div className="pr-list">
          {records.length === 0 && (
            <p className="empty-msg">Inga rekord än. Dags att lyfta tungt!</p>
          )}
          {records.map(({ name, value, isBodyweight }, i) => (
            <div key={i} className="pr-card">
              <span className="ex-name">{name}</span>
              <span className="ex-weight">
                {value} {isBodyweight ? "reps" : "kg"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
