import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [importanceOptions, setImportanceOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    characterImportance: "",
    status: "",
    causeOfDeath: "",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [charsRes, impRes, statusRes] = await Promise.all([
          fetch(`${API_URL}api/characters`),
          fetch(`${API_URL}api/characterImportance`),
          fetch(`${API_URL}api/characterStatus`),
        ]);

        const chars = await charsRes.json();
        const imps = await impRes.json();
        const statuses = await statusRes.json();

        setCharacters(Array.isArray(chars) ? chars : []);
        setImportanceOptions(imps);
        setStatusOptions(statuses);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleOpenUploader = (char) => {
    setSelectedChar(char);
    setNewImageUrl(char.iconhtml || "");
    setShowUploader(true);
  };

  const handleCloseUploader = () => {
    setSelectedChar(null);
    setNewImageUrl("");
    setShowUploader(false);
  };

  const handleSaveImage = async () => {
    if (!selectedChar) return;
    try {
      const res = await fetch(`${API_URL}api/characters/${selectedChar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iconhtml: newImageUrl }),
      });

      if (res.ok) {
        // Immediately fetch updated character to refresh joined fields
        const refreshedRes = await fetch(
          `${API_URL}api/characters/${selectedChar.id}`
        );
        const refreshed = await refreshedRes.json();

        setCharacters((prev) =>
          prev.map((c) => (c.id === refreshed.id ? refreshed : c))
        );

        handleCloseUploader();
      }
    } catch (err) {
      console.error("Error updating character image:", err);
    }
  };

  const handleOpenEditor = (char) => {
    setSelectedChar(char);
    setEditData({
      name: char.name || "",
      description: char.description || "",
      characterImportance: char.characterimportance || "",
      status: char.status || "",
      causeOfDeath: char.causeofdeath || "",
    });
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setSelectedChar(null);
    setEditData({
      name: "",
      description: "",
      characterImportance: "",
      status: "",
      causeOfDeath: "",
    });
    setShowEditor(false);
  };

  const handleSaveCharacter = async () => {
    if (!selectedChar) return;
    try {
      const res = await fetch(`${API_URL}api/characters/${selectedChar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        // Fetch the full updated character with joined info
        const refreshedRes = await fetch(
          `${API_URL}api/characters/${selectedChar.id}`
        );
        const refreshed = await refreshedRes.json();

        setCharacters((prev) =>
          prev.map((c) => (c.id === refreshed.id ? refreshed : c))
        );

        handleCloseEditor();
      }
    } catch (err) {
      console.error("Error updating character info:", err);
    }
  };

  if (loading) return <p>Loading characters...</p>;

  const filteredCharacters = characters.filter((char) =>
    [char.name, char.description]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const grouped = filteredCharacters.reduce((acc, char) => {
    const key = char.importance_label || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(char);
    return acc;
  }, {});

  return (
    <div className="characters-container" style={{ textAlign: "center" }}>
      <section className="hero-section">
        <h1 className="hero-title">Character Archive</h1>
        <p className="hero-subtitle">
          Records of those who fought, survived, or vanished in the Chalnath Expanse campaign.
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <input
            type="text"
            className="modern-input"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "60%",
              maxWidth: "480px",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "1px solid #4da6ff",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.2s ease-in-out",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #80bfff")}
            onBlur={(e) => (e.target.style.border = "1px solid #4da6ff")}
          />
        </div>
      </section>

      {Object.entries(grouped).map(([group, members]) => (
        <section key={group} className="info-section character-section">
          <h2 style={{ color: "#4da6ff" }}>{group}</h2>
          <div className="character-grid">
            {members.map((char) => (
              <CharacterCard
                key={char.id}
                char={char}
                onClick={handleOpenUploader}
                onEdit={handleOpenEditor}
              />
            ))}
          </div>
        </section>
      ))}

      {/* --- Image Uploader Modal --- */}
      {showUploader && (
        <div className="modal-overlay">
          <div className="modal-content">
            {selectedChar ? (
              <>
                <h2>Update Image for {selectedChar.name}</h2>
                <p>Paste the image URL below (from your online upload):</p>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="https://example.com/image.png"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  style={{ marginBottom: "1rem" }}
                />
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                  <button className="modern-btn" onClick={handleSaveImage}>
                    Save
                  </button>
                  <button
                    className="modern-btn"
                    style={{
                      background: "linear-gradient(90deg, #cc0000, #880000)",
                    }}
                    onClick={handleCloseUploader}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p>No character selected.</p>
            )}
          </div>
        </div>
      )}

      {/* --- Character Edit Modal --- */}
      {showEditor && selectedChar && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              background: "linear-gradient(180deg, #1b1b1b 0%, #121212 100%)",
              border: "1px solid #2b2b2b",
              boxShadow: "0 0 15px rgba(0, 210, 255, 0.2)",
              color: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "640px",
              width: "90%",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#00d2ff",
                marginBottom: "1.5rem",
                letterSpacing: "0.5px",
              }}
            >
              Edit Character: {selectedChar.name}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Name</label>
              <input
                type="text"
                className="modern-input"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Description</label>
              <textarea
                className="modern-input"
                rows="3"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                style={{ resize: "vertical" }}
              />

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>
                Importance
              </label>
              <select
                className="modern-input"
                value={editData.characterImportance}
                onChange={(e) =>
                  setEditData({ ...editData, characterImportance: e.target.value })
                }
              >
                <option value="">Select importance</option>
                {importanceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.importance}
                  </option>
                ))}
              </select>

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Status</label>
              <select
                className="modern-input"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="">Select status</option>
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.status}
                  </option>
                ))}
              </select>

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>
                Cause of Death
              </label>
              <input
                type="text"
                className="modern-input"
                value={editData.causeOfDeath}
                onChange={(e) =>
                  setEditData({ ...editData, causeOfDeath: e.target.value })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <button
                className="modern-btn"
                onClick={handleSaveCharacter}
                style={{
                  background: "linear-gradient(90deg, #1e90ff, #00d2ff)",
                  fontWeight: "600",
                  boxShadow: "0 0 12px rgba(0, 210, 255, 0.3)",
                  padding: "0.75rem 2rem",
                }}
              >
                Save
              </button>
              <button
                className="modern-btn"
                onClick={handleCloseEditor}
                style={{
                  background: "linear-gradient(90deg, #cc0000, #880000)",
                  fontWeight: "600",
                  padding: "0.75rem 2rem",
                  boxShadow: "0 0 10px rgba(255, 0, 0, 0.2)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Characters;
