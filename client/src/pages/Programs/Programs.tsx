import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Programs.scss';

interface Exercise {
  _id: string;
  name: string;
}

interface Program {
  _id: string;
  title: string;
  exercises: string[];
}

function Programs() {
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [title, setTitle] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const navigate = useNavigate();

  // State för redigering
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExercises, setEditExercises] = useState<string[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [exRes, progRes] = await Promise.all([
        axios.get('http://localhost:5000/api/exercises'),
        axios.get('http://localhost:5000/api/programs', config)
      ]);
      setLibrary(exRes.data);
      setPrograms(progRes.data);
    } catch {
      console.error("Kunde inte hämta data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Hanterar val av övningar för både "Skapa ny" och "Redigera"
  const toggleExercise = (name: string, isEdit: boolean = false) => {
    if (isEdit) {
      setEditExercises(prev => 
        prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name]
      );
    } else {
      setSelectedExercises(prev => 
        prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name]
      );
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExercises.length === 0) return alert("Välj minst en övning!");
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/programs', 
        { title, exercises: selectedExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle(''); setSelectedExercises([]); fetchData();
    } catch { alert("Kunde inte skapa programmet."); }
  };

  const startEdit = (p: Program) => {
    setEditingId(p._id);
    setEditTitle(p.title);
    setEditExercises([...p.exercises]);
  };

  const handleUpdate = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/programs/${id}`, 
        { title: editTitle, exercises: editExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchData();
    } catch { alert("Kunde inte uppdatera programmet."); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Vill du verkligen ta bort detta program?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { alert("Kunde inte radera programmet."); }
  };

  const startProgram = (p: Program) => {
    navigate('/dashboard', { state: { templateExercises: p.exercises, templateTitle: p.title } });
  };

  return (
    <div className="programs-container">
      <h1>Träningsprogram</h1>

      <section className="create-program-section">
        <h3>Skapa ny mall</h3>
        <form onSubmit={handleCreateProgram}>
          <input 
            placeholder="Namn (t.ex. Push Day)" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <div className="exercise-selector">
            <p>Välj övningar:</p>
            <div className="chip-grid">
              {library.map(ex => (
                <button 
                  key={ex._id} 
                  type="button" 
                  className={`chip ${selectedExercises.includes(ex.name) ? 'active' : ''}`} 
                  onClick={() => toggleExercise(ex.name)}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="save-btn">Spara program</button>
        </form>
      </section>

      <section className="program-list">
        <h3>Dina sparade program</h3>
        <div className="grid">
          {programs.map(p => (
            <div key={p._id} className={`program-card ${editingId === p._id ? 'editing' : ''}`}>
              {editingId === p._id ? (
                <div className="edit-mode">
                  <input 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    className="edit-title-input" 
                  />
                  <div className="chip-grid small">
                    {library.map(ex => (
                      <button 
                        key={ex._id} 
                        type="button" 
                        className={`chip ${editExercises.includes(ex.name) ? 'active' : ''}`} 
                        onClick={() => toggleExercise(ex.name, true)}
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(p._id)} className="confirm-btn">Spara</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Avbryt</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-header-row">
                    <h4>{p.title}</h4>
                    <div className="header-btns">
                      <button onClick={() => startEdit(p)} className="icon-btn">✎</button>
                      <button onClick={() => handleDelete(p._id)} className="icon-btn delete">×</button>
                    </div>
                  </div>
                  <ul>{p.exercises.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
                  <button onClick={() => startProgram(p)} className="start-btn">Starta pass</button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Programs;
