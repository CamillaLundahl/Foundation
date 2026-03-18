import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('user') || 'Användare';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1>Välkommen {username}!</h1>
      <p>Här kommer du snart kunna se och logga dina träningspass.</p>
      <button onClick={handleLogout} className="logout-button">
        Logga ut
      </button>
    </div>
  );
}

export default Dashboard;
