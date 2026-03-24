import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Programs.scss";

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
}

interface Program {
  _id: string;
  title: string;
  exercises: string[];
}

function Programs() {
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  const [exSearch, setExSearch] = useState("");
  const [exCategory, setExCategory] = useState("Alla");

  const [title, setTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExercises, setEditExercises] = useState<string[]>([]);

  const categories = ["Alla", "Ben", "Bröst", "Rygg", "Axlar", "Armar", "Mage"];

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [exRes, progRes] = await Promise.all([
        axios.get("http://localhost:5000/api/exercises"),
        axios.get("http://localhost:5000/api/programs", config),
      ]);
      setLibrary(exRes.data);
      setPrograms(progRes.data);
    } catch {
      console.error("Kunde inte hämta data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLibrary = library
    .filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(exSearch.toLowerCase());
      const matchesCategory =
        exCategory === "Alla" || ex.muscleGroup === exCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleExercise = (name: string, isEdit: boolean = false) => {
    if (isEdit) {
      setEditExercises((prev) =>
        prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name],
      );
    } else {
      setSelectedExercises((prev) =>
        prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name],
      );
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExercises.length === 0) return alert("Välj minst en övning!");
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/programs",
        { title, exercises: selectedExercises },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle("");
      setSelectedExercises([]);
      fetchData();
    } catch {
      alert("Kunde inte skapa programmet.");
    }
  };

  const startEdit = (p: Program) => {
    setEditingId(p._id);
    setEditTitle(p.title);
    setEditExercises([...p.exercises]);
  };

  const handleUpdate = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/programs/${id}`,
        { title: editTitle, exercises: editExercises },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditingId(null);
      fetchData();
    } catch {
      alert("Kunde inte uppdatera.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ta bort programmet?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      alert("Kunde inte radera.");
    }
  };

  const startProgram = (p: Program) => {
    navigate("/dashboard", {
      state: { templateExercises: p.exercises, templateTitle: p.title },
    });
  };

  return (
    <div className="programs-container">
      <h1>Träningsprogram</h1>

      <section className="create-program-section">
        <h3>Skapa nytt program</h3>
        <form onSubmit={handleCreateProgram}>
          <input
            className="main-input"
            placeholder="Namn (t.ex. Push Day)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="exercise-selector-box">
            <header className="selector-header">
              <span>Välj övningar ({selectedExercises.length} valda):</span>
              <div className="selector-controls">
                <input
                  type="text"
                  placeholder="Sök övning..."
                  value={exSearch}
                  onChange={(e) => setExSearch(e.target.value)}
                />
                <select
                  value={exCategory}
                  onChange={(e) => setExCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            <div className="chip-grid">
              {filteredLibrary.map((ex) => (
                <button
                  key={ex._id}
                  type="button"
                  className={`chip ${selectedExercises.includes(ex.name) ? "active" : ""}`}
                  onClick={() => toggleExercise(ex.name)}
                >
                  {ex.name}
                </button>
              ))}
              {filteredLibrary.length === 0 && (
                <p className="no-res">Inga övningar matchar sökningen.</p>
              )}
            </div>
          </div>
          <button type="submit" className="save-btn">
            Spara program
          </button>
        </form>
      </section>

      <section className="program-list">
        <h3>Dina sparade program</h3>
        <div className="grid">
          {programs.map((p) => (
            <div
              key={p._id}
              className={`program-card ${editingId === p._id ? "editing" : ""}`}
            >
              {editingId === p._id ? (
                <div className="edit-mode">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-title-input"
                  />

                  <div className="selector-controls small">
                    <input
                      type="text"
                      placeholder="Sök..."
                      value={exSearch}
                      onChange={(e) => setExSearch(e.target.value)}
                    />
                  </div>

                  <div className="chip-grid small">
                    {filteredLibrary.map((ex) => (
                      <button
                        key={ex._id}
                        type="button"
                        className={`chip ${editExercises.includes(ex.name) ? "active" : ""}`}
                        onClick={() => toggleExercise(ex.name, true)}
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button
                      onClick={() => handleUpdate(p._id)}
                      className="confirm-btn"
                    >
                      Spara
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="cancel-btn"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-header-row">
                    <h4>{p.title}</h4>
                    <div className="header-btns">
                      <button onClick={() => startEdit(p)} className="icon-btn">
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="icon-btn delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <ul>
                    {p.exercises.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                  <button onClick={() => startProgram(p)} className="start-btn">
                    Starta pass
                  </button>
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
