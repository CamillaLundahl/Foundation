import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.scss";

function Profile() {
  const [stats, setStats] = useState({ totalWorkouts: 0, totalVolume: 0 });
  const username = localStorage.getItem("user");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/workouts/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="profile-container">
      <h1>Profil</h1>
      <div className="user-info">
        <div className="avatar">{username?.charAt(0).toUpperCase()}</div>
        <h2>{username}</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Totalt antal pass</span>
          <strong>{stats.totalWorkouts} st</strong>
        </div>
        <div className="stat-card">
          <span>Total volym lyft</span>
          <strong>{stats.totalVolume.toLocaleString()} kg</strong>
        </div>
      </div>
    </div>
  );
}

export default Profile;
