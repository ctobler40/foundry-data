import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function EnvironmentHazards() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/environmentalHazards`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHazards(data);
        else setHazards([]);
        setLoading(false);
      })
      .catch(() => {
        setHazards([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="regroup-loading">Loading Environmental Hazards...</div>;
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Environmental Hazards</h1>
        <p>
          The lethal dangers of the 41st Millennium — radiation, suffocation, fire, and other hazards that test even the strongest warriors.
        </p>
      </div>

      {hazards.length === 0 ? (
        <p className="no-results">No environmental hazards found.</p>
      ) : (
        <div className="regroup-grid">
          {hazards.map((h) => (
            <div key={h.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{h.name}</h3>
              </div>

              <p className="regroup-desc">{h.description || "No description available."}</p>

              {h.effect && (
                <div className="options-section">
                  <h4>Effect</h4>
                  <p className="option-effect">{h.effect}</p>
                </div>
              )}

              {h.test_required && (
                <div className="options-section">
                  <h4>Test Required</h4>
                  <p className="option-effect">{h.test_required}</p>
                </div>
              )}

              {h.dn_example && (
                <p className="regroup-notes">
                  <strong>DN Example:</strong> {h.dn_example}
                </p>
              )}

              {h.damage && (
                <p className="regroup-notes">
                  <strong>Damage:</strong> {h.damage}
                </p>
              )}

              {h.duration && (
                <p className="regroup-notes">
                  <strong>Duration:</strong> {h.duration}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
