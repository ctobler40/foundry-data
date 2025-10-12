import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CharacterProfile({ id, subtitle = "Member of FAFO" }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`${API_URL}api/mainCharacters/${id}`);
        if (!res.ok) throw new Error("Failed to fetch character");
        const data = await res.json();
        setCharacter(data);
      } catch (err) {
        console.error(`Error loading character ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  const handleUpdate = async (field) => {
    if (!character) return;

    try {
      let updatedValue;
      if (field === "notable_quotes" || field === "notable_moments") {
        updatedValue = newValue
          .split("\n")
          .map((line) => line.trim())
          .filter((l) => l !== "");
      } else {
        updatedValue = newValue;
      }

      const updatedData = {
        name: character.name,
        photo_url: character.photo_url,
        personal_details:
          field === "personal_details"
            ? updatedValue
            : character.personal_details,
        background:
          field === "background" ? updatedValue : character.background,
        notable_quotes:
          field === "notable_quotes"
            ? updatedValue
            : character.notable_quotes || [],
        notable_moments:
          field === "notable_moments"
            ? updatedValue
            : character.notable_moments || [],
        character_id: character.character_id || null,
      };

      const res = await fetch(`${API_URL}api/mainCharacters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update character");

      const updated = await res.json();
      setCharacter(updated);
      setEditingField(null);
      setNewValue("");
    } catch (err) {
      console.error("Error updating character:", err);
    }
  };

  if (loading) return <div className="character-loading">Loading...</div>;
  if (!character)
    return <div className="character-error">Character data unavailable.</div>;

  return (
    <div className="profile-page">
      {/* ===== Header ===== */}
      <div className="profile-header">
        <h1 className="profile-title">{character.name}</h1>
        <p className="profile-subtitle">{subtitle}</p>
      </div>

      {/* ===== Image ===== */}
      {character.photo_url && (
        <img
          src={character.photo_url}
          alt={character.name}
          className="profile-photo"
        />
      )}

      {/* ===== Content Grid ===== */}
      <div className="profile-grid">
        {/* Personal Details */}
        <div className="profile-section">
          <h2>Personal Details</h2>
          <p>{character.personal_details || "No details available."}</p>
          <button
            className="modern-btn"
            onClick={() => {
              setEditingField("personal_details");
              setNewValue(character.personal_details || "");
            }}
          >
            Update Personal Details
          </button>
        </div>

        {/* Background */}
        <div className="profile-section">
          <h2>Background</h2>
          <p>{character.background || "No background provided."}</p>
          <button
            className="modern-btn"
            onClick={() => {
              setEditingField("background");
              setNewValue(character.background || "");
            }}
          >
            Update Background
          </button>
        </div>

        {/* Notable Quotes */}
        <div className="profile-section">
          <h2>Notable Quotes</h2>
          {character.notable_quotes?.length ? (
            <ul className="quote-list">
              {character.notable_quotes.map((q, idx) => (
                <li key={idx} className="quote-item">
                  “{q}”
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#888" }}>No quotes yet.</p>
          )}
          <button
            className="modern-btn"
            onClick={() => {
              setEditingField("notable_quotes");
              setNewValue(character.notable_quotes?.join("\n") || "");
            }}
          >
            Update Notable Quotes
          </button>
        </div>

        {/* Notable Moments */}
        <div className="profile-section">
          <h2>Notable Moments</h2>
          {character.notable_moments?.length ? (
            <ul className="moment-list">
              {character.notable_moments.map((m, idx) => (
                <li key={idx} className="moment-item">
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#888" }}>No moments yet.</p>
          )}
          <button
            className="modern-btn"
            onClick={() => {
              setEditingField("notable_moments");
              setNewValue(character.notable_moments?.join("\n") || "");
            }}
          >
            Update Notable Moments
          </button>
        </div>
      </div>

      {/* ===== Edit Modal ===== */}
      {editingField && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setEditingField(null)}>
              ×
            </button>
            <h3 style={{ marginBottom: "1rem" }}>
              Update {editingField.replace("_", " ")}
            </h3>
            <textarea
              className="modern-input"
              style={{ minHeight: "120px", marginBottom: "1rem" }}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter new content..."
            />
            <button
              className="modern-btn"
              onClick={() => handleUpdate(editingField)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
