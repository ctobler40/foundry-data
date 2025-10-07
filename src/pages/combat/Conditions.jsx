import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Conditions() {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/conditions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setConditions(data);
        else setConditions([]);
        setLoading(false);
      })
      .catch(() => {
        setConditions([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="regroup-loading">Loading Conditions...</div>;
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Conditions</h1>
        <p>
          Persistent states that affect combatants in various ways — including wounds, fear, exhaustion, and other situational effects.
        </p>
      </div>

      {conditions.length === 0 ? (
        <p className="no-results">No combat conditions found.</p>
      ) : (
        <div className="regroup-grid">
          {conditions.map((c) => (
            <div key={c.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{c.name}</h3>
              </div>

              <p className="regroup-desc">{c.description || "No description available."}</p>

              {c.mechanical_effect && (
                <div className="options-section">
                  <h4>Mechanical Effect</h4>
                  <p className="option-effect">{c.mechanical_effect}</p>
                </div>
              )}

              {c.duration && (
                <p className="regroup-notes">
                  <strong>Duration:</strong> {c.duration}
                </p>
              )}

              {c.removal_method && (
                <p className="regroup-notes">
                  <strong>Removal:</strong> {c.removal_method}
                </p>
              )}

              {c.source_page && (
                <p
                  className="regroup-notes"
                  style={{ color: "#777", fontSize: "0.85rem" }}
                >
                  <em>Source: Page {c.source_page}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
