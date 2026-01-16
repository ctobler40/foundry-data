import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Haephos() {
  const [campaign, setCampaign] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [factions, setFactions] = useState([]);
  const [editingPlanetId, setEditingPlanetId] = useState(null);
  const [planetForm, setPlanetForm] = useState({
    details: "",
    population: "",
    exports: "",
    environment: "",
  });
  const [planetSaving, setPlanetSaving] = useState(false);
  const [planetError, setPlanetError] = useState("");
  const [editingFactionId, setEditingFactionId] = useState(null);
  const [factionForm, setFactionForm] = useState({
    name: "",
    description: "",
    territory: "",
    exports: "",
    status: "",
  });
  const [factionSaving, setFactionSaving] = useState(false);
  const [factionError, setFactionError] = useState("");
  const [showAddFaction, setShowAddFaction] = useState(false);

  const startEditFaction = (f) => {
  setFactionError("");
  setEditingFactionId(f.id);
  setFactionForm({
    name: f.name ?? "",
    description: f.description ?? "",
    territory: f.territory ?? "",
    exports: f.exports ?? "",
    status: f.status ?? "",
  });
};

const cancelEditFaction = () => {
  setEditingFactionId(null);
  setFactionError("");
  setFactionSaving(false);
};

const startAddFaction = () => {
  setFactionError("");
  setShowAddFaction(true);
  setEditingFactionId("new");
  setFactionForm({
    name: "",
    description: "",
    territory: "",
    exports: "",
    status: "",
  });
};

const cancelAddFaction = () => {
  setShowAddFaction(false);
  cancelEditFaction();
};

const saveFaction = async (factionIdOrNew) => {
  setFactionSaving(true);
  setFactionError("");

  const isNew = factionIdOrNew === "new";
  const url = isNew
    ? `${API_URL}api/campaign/factions`
    : `${API_URL}api/campaign/factions/${factionIdOrNew}`;

  try {
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: 1,
        planet_id: 2, // Haephos
        name: factionForm.name,
        description: factionForm.description,
        territory: factionForm.territory,
        exports: factionForm.exports,
        status: factionForm.status,
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `Faction save failed (${res.status})`);
    }

    const saved = await res.json();

    if (isNew) {
      setFactions((prev) => [saved, ...prev]);
      setShowAddFaction(false);
    } else {
      setFactions((prev) => prev.map((f) => (f.id === saved.id ? saved : f)));
    }

    setEditingFactionId(null);
  } catch (e) {
    console.error(e);
    setFactionError(e.message || "Failed to save faction.");
  } finally {
    setFactionSaving(false);
  }
};

const deleteFaction = async (id) => {
  if (!window.confirm("Delete this faction?")) return;

  try {
    const res = await fetch(`${API_URL}api/campaign/factions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `Delete failed (${res.status})`);
    }

    setFactions((prev) => prev.filter((f) => f.id !== id));
    if (editingFactionId === id) cancelEditFaction();
  } catch (e) {
    console.error(e);
    setFactionError(e.message || "Failed to delete faction.");
  }
};

  useEffect(() => {
    fetch(`${API_URL}api/campaign`)
      .then((res) => res.json())
      .then(setCampaign)
      .catch(console.error);

    fetch(`${API_URL}api/campaign/planets`)
      .then((res) => res.json())
      .then(setPlanets)
      .catch(console.error);

    fetch(`${API_URL}api/campaign/factions`)
      .then((res) => res.json())
      .then(setFactions)
      .catch(console.error);
  }, []);

  if (!campaign) return <p>Loading location data...</p>;

    const startEditPlanet = (p) => {
    setPlanetError("");
    setEditingPlanetId(p.id);
    setPlanetForm({
      details: p.details ?? "",
      population: p.population ?? "",
      exports: p.exports ?? "",
      environment: p.environment ?? "",
    });
  };

  const cancelEditPlanet = () => {
    setEditingPlanetId(null);
    setPlanetError("");
    setPlanetSaving(false);
  };

  const savePlanet = async (planetId) => {
    setPlanetSaving(true);
    setPlanetError("");

    try {
      const res = await fetch(`${API_URL}api/campaign/planets/${planetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: planetForm.details,
          population: planetForm.population,
          exports: planetForm.exports,
          environment: planetForm.environment,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Update failed (${res.status})`);
      }

      const updated = await res.json();

      // update local planets list in-place
      setPlanets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

      setEditingPlanetId(null);
    } catch (e) {
      console.error(e);
      setPlanetError(e.message || "Failed to update planet.");
    } finally {
      setPlanetSaving(false);
    }
  };

  return (
    <div className="location-page" style={{ textAlign: "center", color: "#fff" }}>
      {/* -------------------- HEADER -------------------- */}
      {/* <section className="hero-section">
        <h1 className="hero-title">Haephos</h1>
        {/* <p className="hero-subtitle">
          A vast industrial world orbiting the dying sun of the Chalnath Expanse — home to forges,
          manufactoria, and machine cults that have endured centuries of ceaseless labor.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <Link to="/campaign" className="modern-btn">
            ← Back to Campaign Overview
          </Link>
        </div>
      </section> */}

      {/* -------------------- OVERVIEW -------------------- */}
      {/* <section className="info-section">
        <h2>Overview</h2>
        <p className="section-text">{campaign.setting}</p>
        <p className="section-text">{campaign.current_state}</p>
        <p className="section-text">{campaign.call_for_aid}</p>
      </section> */}

      {/* -------------------- PLANET DETAILS -------------------- */}
      <section className="info-section">
        <h2>Planet Details</h2>

        {planets.length > 0 ? (
          planets
            .filter((p) => p.name === "Haephos")
            .map((p) => {
              const isEditing = editingPlanetId === p.id;

              return (
                <div
                  key={p.id}
                  className="feature-card"
                  style={{
                    background: "#1e1e1e",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    boxShadow: "0 0 10px rgba(255, 128, 0, 0.25)",
                    textAlign: "left",
                    maxWidth: "900px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {/* Header + Edit Controls */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2 style={{ color: "#ff944d", margin: 0 }}>{p.name}</h2>

                    {!isEditing ? (
                      <button
                        onClick={() => startEditPlanet(p)}
                        style={{
                          background: "rgba(255,148,77,0.12)",
                          border: "1px solid rgba(255,148,77,0.35)",
                          color: "#ff944d",
                          padding: "0.45rem 0.8rem",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        ✎ Edit
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={cancelEditPlanet}
                          disabled={planetSaving}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#fff",
                            padding: "0.45rem 0.8rem",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => savePlanet(p.id)}
                          disabled={planetSaving}
                          style={{
                            background: "rgba(255,148,77,0.12)",
                            border: "1px solid rgba(255,148,77,0.45)",
                            color: "#ff944d",
                            padding: "0.45rem 0.8rem",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          {planetSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {planetError && isEditing && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        background: "rgba(240,105,105,0.12)",
                        border: "1px solid rgba(240,105,105,0.35)",
                        color: "#ffd2d2",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "10px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {planetError}
                    </div>
                  )}

                  {/* Fields */}
                  <div style={{ marginTop: "0.9rem", display: "grid", gap: "0.8rem" }}>
                    {/* DETAILS */}
                    <div>
                      <strong style={{ color: "#ffb487" }}>Details</strong>
                      {!isEditing ? (
                        <p>{p.details}</p>
                      ) : (
                        <textarea
                          rows={5}
                          value={planetForm.details}
                          onChange={(e) =>
                            setPlanetForm((prev) => ({
                              ...prev,
                              details: e.target.value,
                            }))
                          }
                          style={planetInput}
                        />
                      )}
                    </div>

                    {/* POPULATION */}
                    <div>
                      <strong style={{ color: "#ffb487" }}>Population</strong>
                      {!isEditing ? (
                        <p>{p.population || "—"}</p>
                      ) : (
                        <input
                          value={planetForm.population}
                          onChange={(e) =>
                            setPlanetForm((prev) => ({
                              ...prev,
                              population: e.target.value,
                            }))
                          }
                          placeholder="e.g. 12.4B"
                          style={planetInput}
                        />
                      )}
                    </div>

                    {/* EXPORTS */}
                    <div>
                      <strong style={{ color: "#ffb487" }}>Exports</strong>
                      {!isEditing ? (
                        <p>{p.exports || "—"}</p>
                      ) : (
                        <input
                          value={planetForm.exports}
                          onChange={(e) =>
                            setPlanetForm((prev) => ({
                              ...prev,
                              exports: e.target.value,
                            }))
                          }
                          placeholder="e.g. Adamantium plate"
                          style={planetInput}
                        />
                      )}
                    </div>

                    {/* ENVIRONMENT */}
                    <div>
                      <strong style={{ color: "#ffb487" }}>Environment</strong>
                      {!isEditing ? (
                        <p>{p.environment || "—"}</p>
                      ) : (
                        <input
                          value={planetForm.environment}
                          onChange={(e) =>
                            setPlanetForm((prev) => ({
                              ...prev,
                              environment: e.target.value,
                            }))
                          }
                          placeholder="e.g. Forge cities, ash deserts"
                          style={planetInput}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <p>Loading planet details...</p>
        )}
      </section>

      {/* -------------------- FACTIONS -------------------- */}
      <section className="info-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Major Factions</h2>

          {editingFactionId !== "new" ? (
            <button
              onClick={startAddFaction}
              style={{
                background: "rgba(255,148,77,0.12)",
                border: "1px solid rgba(255,148,77,0.35)",
                color: "#ff944d",
                padding: "0.45rem 0.8rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              + Add Faction
            </button>
          ) : null}
        </div>

        {factionError && (
          <div
            style={{
              marginTop: "0.75rem",
              background: "rgba(240,105,105,0.12)",
              border: "1px solid rgba(240,105,105,0.35)",
              color: "#ffd2d2",
              padding: "0.6rem 0.75rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              textAlign: "left",
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {factionError}
          </div>
        )}

        <div
          className="feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {/* ADD NEW CARD */}
          {editingFactionId === "new" && (
            <div
              className="feature-card"
              style={{
                background: "#1e1e1e",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 0 10px rgba(255, 128, 0, 0.25)",
                textAlign: "left",
              }}
            >
              <h3 style={{ color: "#ff944d", marginTop: 0 }}>New Faction</h3>

              <div style={{ display: "grid", gap: "0.6rem" }}>
                <input
                  value={factionForm.name}
                  onChange={(e) => setFactionForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Faction name"
                  style={planetInput}
                />
                <textarea
                  rows={4}
                  value={factionForm.description}
                  onChange={(e) => setFactionForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                  style={planetInput}
                />
                <input
                  value={factionForm.territory}
                  onChange={(e) => setFactionForm((p) => ({ ...p, territory: e.target.value }))}
                  placeholder="Territory"
                  style={planetInput}
                />
                <input
                  value={factionForm.exports}
                  onChange={(e) => setFactionForm((p) => ({ ...p, exports: e.target.value }))}
                  placeholder="Exports"
                  style={planetInput}
                />
                <input
                  value={factionForm.status}
                  onChange={(e) => setFactionForm((p) => ({ ...p, status: e.target.value }))}
                  placeholder="Status"
                  style={planetInput}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.9rem" }}>
                <button
                  onClick={cancelAddFaction}
                  disabled={factionSaving}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveFaction("new")}
                  disabled={factionSaving}
                  style={{
                    background: "rgba(255,148,77,0.12)",
                    border: "1px solid rgba(255,148,77,0.45)",
                    color: "#ff944d",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {factionSaving ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          )}

          {/* EXISTING FACTIONS */}
          {factions.length > 0 ? (
            factions
              .filter((f) => f.planet_id === 2) // Haephos only
              .map((f) => {
                const isEditing = editingFactionId === f.id;

                return (
                  <div
                    key={f.id}
                    className="feature-card"
                    style={{
                      background: "#1e1e1e",
                      borderRadius: "12px",
                      padding: "1rem",
                      boxShadow: "0 0 10px rgba(255, 128, 0, 0.25)",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                      <h3 style={{ color: "#ff944d", marginTop: 0 }}>
                        {!isEditing ? f.name : "Edit Faction"}
                      </h3>

                      {!isEditing ? (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => startEditFaction(f)}
                            style={{
                              background: "rgba(255,148,77,0.12)",
                              border: "1px solid rgba(255,148,77,0.35)",
                              color: "#ff944d",
                              padding: "0.35rem 0.6rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteFaction(f.id)}
                            style={{
                              background: "rgba(240,105,105,0.12)",
                              border: "1px solid rgba(240,105,105,0.35)",
                              color: "#ffb3b3",
                              padding: "0.35rem 0.6rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={cancelEditFaction}
                            disabled={factionSaving}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.18)",
                              color: "#fff",
                              padding: "0.35rem 0.6rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveFaction(f.id)}
                            disabled={factionSaving}
                            style={{
                              background: "rgba(255,148,77,0.12)",
                              border: "1px solid rgba(255,148,77,0.45)",
                              color: "#ff944d",
                              padding: "0.35rem 0.6rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: 800,
                            }}
                          >
                            {factionSaving ? "Saving..." : "Save"}
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditing ? (
                      <>
                        <p>{f.description}</p>
                        {f.territory && (
                          <p><strong>Territory:</strong> {f.territory}</p>
                        )}
                        {f.exports && (
                          <p><strong>Exports:</strong> {f.exports}</p>
                        )}
                        {f.status && (
                          <p><strong>Status:</strong> {f.status}</p>
                        )}
                      </>
                    ) : (
                      <div style={{ display: "grid", gap: "0.6rem" }}>
                        <input
                          value={factionForm.name}
                          onChange={(e) => setFactionForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Faction name"
                          style={planetInput}
                        />
                        <textarea
                          rows={4}
                          value={factionForm.description}
                          onChange={(e) => setFactionForm((p) => ({ ...p, description: e.target.value }))}
                          placeholder="Description"
                          style={planetInput}
                        />
                        <input
                          value={factionForm.territory}
                          onChange={(e) => setFactionForm((p) => ({ ...p, territory: e.target.value }))}
                          placeholder="Territory"
                          style={planetInput}
                        />
                        <input
                          value={factionForm.exports}
                          onChange={(e) => setFactionForm((p) => ({ ...p, exports: e.target.value }))}
                          placeholder="Exports"
                          style={planetInput}
                        />
                        <input
                          value={factionForm.status}
                          onChange={(e) => setFactionForm((p) => ({ ...p, status: e.target.value }))}
                          placeholder="Status"
                          style={planetInput}
                        />
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <p>Loading faction data...</p>
          )}
        </div>
      </section>
    </div>
  );
}

const planetInput = {
  width: "100%",
  padding: "0.6rem 0.7rem",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  outline: "none",
};
