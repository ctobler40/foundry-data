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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [importanceOptions, setImportanceOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const emptyEditData = {
    name: "",
    description: "",
    characterImportance: "",
    status: "",
    causeOfDeath: "",
    iconhtml: "",
  };

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
    setSelectedFile(null);
    setUploadError("");
    setUploadingImage(false);
    setUploadedUrl(char.iconhtml || ""); // show current image if it exists
    setShowUploader(true);
  };

  const handleCloseUploader = () => {
    setSelectedChar(null);
    setSelectedFile(null);
    setUploadError("");
    setUploadingImage(false);
    setUploadedUrl("");
    setShowUploader(false);
  };

  const handleSaveImage = async () => {
    if (!selectedChar) return;

    // Must choose a file OR already have an uploadedUrl
    if (!selectedFile && !uploadedUrl) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      let finalUrl = uploadedUrl;

      // If user picked a new file, upload it first
      if (selectedFile) {
        const fd = new FormData();
        fd.append("image", selectedFile);

        const uploadRes = await fetch(`${API_URL}api/upload/image`, {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const msg = await uploadRes.text().catch(() => "");
          throw new Error(msg || `Image upload failed (${uploadRes.status})`);
        }

        const uploaded = await uploadRes.json();
        finalUrl = uploaded.url;        // secure_url from Cloudinary
        setUploadedUrl(finalUrl);       // update preview immediately
      }

      // Save url into the character (you’re currently using iconhtml)
      const res = await fetch(`${API_URL}api/characters/${selectedChar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iconhtml: finalUrl }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Character update failed (${res.status})`);
      }

      // Refresh that one character
      const refreshedRes = await fetch(`${API_URL}api/characters/${selectedChar.id}`);
      const refreshed = await refreshedRes.json();

      setCharacters((prev) =>
        prev.map((c) => (c.id === refreshed.id ? refreshed : c))
      );

      handleCloseUploader();
    } catch (err) {
      console.error("Error updating character image:", err);
      setUploadError(err?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
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

  const handleCreateCharacter = async () => {
    try {
      const payload = {
        name: editData.name,
        description: editData.description,
        characterImportance: editData.characterImportance || null,
        status: editData.status || null,
        causeOfDeath: editData.causeOfDeath || null,
        iconhtml: editData.iconhtml || null,
      };

      const res = await fetch(`${API_URL}api/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return;

      const created = await res.json();

      // put newest at top, or sort by id; your call
      setCharacters((prev) => [...prev, created].sort((a, b) => a.id - b.id));

      setShowCreate(false);
      setEditData({ ...emptyEditData });
    } catch (err) {
      console.error("Error creating character:", err);
    }
  };

  return (
    <div className="characters-container" style={{ textAlign: "center" }}>
      <section className="hero-section">
        <h1 className="hero-title">Character Archive</h1>
        <p className="hero-subtitle">
          Records of those who fought, survived, or vanished in the Chalnath Expanse campaign.
        </p>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            className="modern-btn"
            onClick={() => {
              setEditData({ ...emptyEditData });
              setSelectedChar(null);
              setShowCreate(true);
            }}
            style={{ background: "linear-gradient(90deg, #1e90ff, #00d2ff)", fontWeight: 600 }}
          >
            + New Character
          </button>
        </div>

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
                <p>Select an image file to upload:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                      setUploadError("");
                      if (file) {
                        // local preview while waiting
                        setUploadedUrl(URL.createObjectURL(file));
                      }
                    }}
                    style={{ marginBottom: "1rem" }}
                  />

                  {uploadedUrl && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ marginBottom: "0.5rem" }}>Preview:</p>
                      <img
                        src={uploadedUrl}
                        alt="preview"
                        style={{
                          width: "220px",
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "1px solid #2b2b2b",
                          boxShadow: "0 0 12px rgba(0, 210, 255, 0.15)",
                        }}
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p style={{ color: "salmon", marginBottom: "1rem" }}>
                      {uploadError}
                    </p>
                  )}
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                  <button
                    className="modern-btn"
                    onClick={handleSaveImage}
                    disabled={uploadingImage || (!selectedFile && !uploadedUrl)}
                  >
                    {uploadingImage ? "Uploading..." : "Save"}
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

      {/* --- Character Create Modal --- */}
      {showCreate && (
        <div className="modal-overlay">
          <div style={{
            background: "linear-gradient(180deg, #1b1b1b 0%, #121212 100%)",
            border: "1px solid #2b2b2b",
            boxShadow: "0 0 15px rgba(0, 210, 255, 0.2)",
            color: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            maxWidth: "640px",
            width: "90%",
            fontFamily: "Roboto, sans-serif",
          }}>
            <h2 style={{ textAlign: "center", color: "#00d2ff", marginBottom: "1.5rem" }}>
              Create New Character
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                style={{ resize: "vertical" }}
              />

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Importance</label>
              <select
                className="modern-input"
                value={editData.characterImportance}
                onChange={(e) => setEditData({ ...editData, characterImportance: e.target.value })}
              >
                <option value="">Select importance</option>
                {importanceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.importance}</option>
                ))}
              </select>

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Status</label>
              <select
                className="modern-input"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="">Select status</option>
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.status}</option>
                ))}
              </select>

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Cause of Death</label>
              <input
                type="text"
                className="modern-input"
                value={editData.causeOfDeath}
                onChange={(e) => setEditData({ ...editData, causeOfDeath: e.target.value })}
              />

              <label style={{ color: "#9fd3ff", fontWeight: "600" }}>Icon URL</label>
              <input
                type="text"
                className="modern-input"
                placeholder="https://example.com/icon.png"
                value={editData.iconhtml || ""}
                onChange={(e) => setEditData({ ...editData, iconhtml: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
              <button
                className="modern-btn"
                onClick={handleCreateCharacter}
                style={{
                  background: "linear-gradient(90deg, #1e90ff, #00d2ff)",
                  fontWeight: "600",
                  boxShadow: "0 0 12px rgba(0, 210, 255, 0.3)",
                  padding: "0.75rem 2rem",
                }}
              >
                Create
              </button>

              <button
                className="modern-btn"
                onClick={() => {
                  setShowCreate(false);
                  setEditData({ ...emptyEditData });
                }}
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
