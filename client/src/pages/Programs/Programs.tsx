import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Programs.scss";
import type { Exercise, Program } from "../../types";

/**
 * Programs Component
 * This component allows users to create, view, edit, and delete workout templates (programs).
 * It also allows users to "start" a program by sending the data to the Dashboard.
 */
function Programs() {
  // Data states
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // UI and filter state
  const [exSearch, setExSearch] = useState("");
  const [exCategory, setExCategory] = useState("Alla");

  // Create Program state
  const [title, setTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const navigate = useNavigate();

  // Edit Program state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExercises, setEditExercises] = useState<string[]>([]);

  const categories = ["Alla", "Ben", "Bröst", "Rygg", "Axlar", "Armar", "Mage"];

  /**
   * Fetches data from the backend.
   * Uses Promise.all to fetch both the exercise library and user programs concurrently.
   */
  const fetchData = async () => {
    try {
      const [exRes, progRes] = await Promise.all([
        api.get("/exercises"),
        api.get("/programs"),
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

  /**
   * Filtering logic for the exercise library.
   * Filters by name (search string) and muscle group (category).
   * Also sorts the results alphabetically.
   */
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

  /**
   * Handles the creation of a new workout program.
   * Validates that at least one exercise is selected before sending to the API.
   */
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExercises.length === 0) return alert("Välj minst en övning!");
    try {
      await api.post(
        "/programs",
        { title, exercises: selectedExercises }
      );
      // Reset form on success
      setTitle("");
      setSelectedExercises([]);
      fetchData();
    } catch {
      alert("Kunde inte skapa programmet.");
    }
  };

  // Editing a program
  const startEdit = (p: Program) => {
    setEditingId(p._id);
    setEditTitle(p.title);
    setEditExercises([...p.exercises]);
  };

  // Send updated data to the API
  const handleUpdate = async (id: string) => {
    try {
      await api.put(
        `/programs/${id}`,
        { title: editTitle, exercises: editExercises }
      );
      setEditingId(null); //Exit edit mode
      fetchData();
    } catch {
      alert("Kunde inte uppdatera.");
    }
  };

  // Delete a program after confirmation
  const handleDelete = async (id: string) => {
    if (!window.confirm("Ta bort programmet?")) return;
    try {
      await api.delete(`/programs/${id}`);
      fetchData();
    } catch {
      alert("Kunde inte radera.");
    }
  };

  // Start a program by navigating to the Dashboard
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
