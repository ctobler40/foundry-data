import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

const CHARACTER_MAP = {
  hrellik: 1,
  kaleson: 2,
  agnes: 3,
  joe: 4,
  dahlia: 5,
};

export default function FAFO() {
  const { name } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState("");

  const characterId = CHARACTER_MAP[name?.toLowerCase()];

  // Fetch Character Data
  useEffect(() => {
    const fetchCharacter = async () => {
      if (!characterId) return;

      try {
        const res = await fetch(`${API_URL}api/mainCharacters/${characterId}`);
        if (!res.ok) throw new Error("Failed to fetch character");
        const data = await res.json();
        setCharacter(data);
      } catch (err) {
        console.error(`Error loading ${name} data:`, err);
        setCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [name, characterId]);

  // Handle Update Submission
    const handleUpdate = async (field) => {
    try {
        if (!character) return;

        // prepare new value
        let updatedValue;
        if (field === "notable_quotes" || field === "notable_moments") {
        updatedValue = newValue
            .split("\n")
            .map((line) => line.trim())
            .filter((l) => l !== "");
        } else {
        updatedValue = newValue;
        }

        // send all existing fields + the updated one
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

        const res = await fetch(`${API_URL}api/mainCharacters/${characterId}`, {
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

  if (loading) {
    return <div className="character-loading">Loading {name}’s profile...</div>;
  }

  if (!character) {
    return <div className="character-error">Character data unavailable.</div>;
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-title">{character.name}</h1>
        <p className="profile-subtitle">Member of FAFO</p>
      </div>

      {/* Photo */}
      {character.photo_url && (
        <img
          src={character.photo_url}
          alt={character.name}
          className="profile-photo"
        />
      )}

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
        {character.notable_quotes && character.notable_quotes.length > 0 ? (
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
            setNewValue(
              character.notable_quotes?.join("\n") || ""
            );
          }}
        >
          Update Notable Quotes
        </button>
      </div>

      {/* Notable Moments */}
      <div className="profile-section">
        <h2>Notable Moments</h2>
        {character.notable_moments && character.notable_moments.length > 0 ? (
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
            setNewValue(
              character.notable_moments?.join("\n") || ""
            );
          }}
        >
          Update Notable Moments
        </button>
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setEditingField(null)}
            >
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
