import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function AttackModifiers() {
  const [modifiers, setModifiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/attackModifiers`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setModifiers(data);
        else setModifiers([]);
        setLoading(false);
      })
      .catch(() => {
        setModifiers([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="regroup-loading">
        Loading Attack Modifiers...
      </div>
    );
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Attack Modifiers</h1>
        <p>
          Modifiers applied to combat tests based on range, movement, or environmental factors. These influence the DN and final attack outcome.
        </p>
      </div>

      {modifiers.length === 0 ? (
        <p className="no-results">No attack modifiers found.</p>
      ) : (
        <div className="regroup-grid">
          {modifiers.map((m) => (
            <div key={m.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{m.name}</h3>
              </div>

              <p className="regroup-desc">{m.description || "No description available."}</p>

              {m.modifier_type && (
                <p className="regroup-notes">
                  <strong>Type:</strong> {m.modifier_type}
                </p>
              )}

              {m.effect && (
                <div className="options-section">
                  <h4>Effect</h4>
                  <p className="option-effect">{m.effect}</p>
                </div>
              )}

              {m.condition && (
                <div className="options-section">
                  <h4>Condition</h4>
                  <p className="option-effect">{m.condition}</p>
                </div>
              )}

              {m.source_page && (
                <p
                  className="regroup-notes"
                  style={{ color: "#777", fontSize: "0.85rem" }}
                >
                  <em>Source: Page {m.source_page}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
