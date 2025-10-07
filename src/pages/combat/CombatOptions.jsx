import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CombatOptions() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/combatOptions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOptions(data);
        else setOptions([]);
        setLoading(false);
      })
      .catch(() => {
        setOptions([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="regroup-loading">
        Loading Combat Options...
      </div>
    );
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Options</h1>
        <p>
          Tactical adjustments to your attacks and defenses that can alter dice rolls, DN, or overall effectiveness during combat.
        </p>
      </div>

      {options.length === 0 ? (
        <p className="no-results">No combat options found.</p>
      ) : (
        <div className="regroup-grid">
          {options.map((opt) => (
            <div key={opt.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{opt.name}</h3>
              </div>

              <p className="regroup-desc">{opt.description || "No description available."}</p>

              {opt.option_type && (
                <p className="regroup-notes">
                  <strong>Type:</strong> {opt.option_type}
                </p>
              )}

              {opt.dn_modifier && (
                <p className="regroup-notes">
                  <strong>DN Modifier:</strong> {opt.dn_modifier}
                </p>
              )}

              {opt.effect && (
                <div className="options-section">
                  <h4>Effect</h4>
                  <p className="option-effect">{opt.effect}</p>
                </div>
              )}

              {opt.source_page && (
                <p
                  className="regroup-notes"
                  style={{ color: "#777", fontSize: "0.85rem" }}
                >
                  <em>Source: Page {opt.source_page}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
