import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Exercises from './pages/Exercises/Exercises';
import Programs from './pages/Programs/Programs';

function App() {
  return (
    <Router>
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/programs" element={<Programs />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
