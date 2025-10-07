import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CombatActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/combatActions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setActions(data);
        else setActions([]);
        setLoading(false);
      })
      .catch(() => {
        setActions([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="regroup-loading">
        Loading Combat Actions...
      </div>
    );
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Actions</h1>
        <p>
          A list of all available combat actions used in battle. Each entry shows its type, requirements, duration, and key effects.
        </p>
      </div>

      {actions.length === 0 ? (
        <p className="no-results">No combat actions found.</p>
      ) : (
        <div className="regroup-grid">
          {actions.map((a) => (
            <div key={a.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{a.name}</h3>
              </div>

              <p className="regroup-desc">{a.description || "No description available."}</p>

              {a.action_type && (
                <p className="regroup-notes">
                  <strong>Type:</strong> {a.action_type}
                </p>
              )}

              {a.requirements && (
                <p className="regroup-notes">
                  <strong>Requirements:</strong> {a.requirements}
                </p>
              )}

              {a.dice_bonus && (
                <p className="regroup-notes">
                  <strong>Dice Bonus:</strong> {a.dice_bonus}
                </p>
              )}

              {a.duration && (
                <p className="regroup-notes">
                  <strong>Duration:</strong> {a.duration}
                </p>
              )}

              {a.effects && (
                <div className="options-section">
                  <h4>Effect</h4>
                  <p className="option-effect">{a.effects}</p>
                </div>
              )}

              {a.source_page && (
                <p className="regroup-notes" style={{ color: "#777", fontSize: "0.85rem" }}>
                  <em>Source: Page {a.source_page}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
