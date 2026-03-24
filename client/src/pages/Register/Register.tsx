import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Login/Login.scss";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Lösenorden matchar inte!");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.username);
      
      navigate("/dashboard");
    } catch {
      alert("Registrering misslyckades. Användarnamnet kan vara upptaget.");
    }
  };

  return (
    <div className="login-container">
      <h1>Skapa konto</h1>
      <p>Börja din resa med Foundation idag</p>
      <form onSubmit={handleRegister} className="login-form">
        <div className="input-group">
          <label>Användarnamn</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Bekräfta lösenord</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Registrera dig
        </button>
        <p className="switch-auth">
          Har du redan ett konto? <Link to="/">Logga in här</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
