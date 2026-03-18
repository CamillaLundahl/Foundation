import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      alert(`Välkommen ${res.data.username}! Du är inloggad.`);
    } catch (err) {
      alert('Inloggning misslyckades. Kolla användarnamn och lösenord.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h2>Foundation - Logga in</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '250px' }}>
        <input 
          type="text" 
          placeholder="Användarnamn" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Lösenord" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logga in
        </button>
      </form>
    </div>
  );
}

export default Login;
