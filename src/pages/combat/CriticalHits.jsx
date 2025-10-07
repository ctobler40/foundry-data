import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CriticalHits() {
  const [critHits, setCritHits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/criticalHits`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCritHits(data);
        else setCritHits([]);
        setLoading(false);
      })
      .catch(() => {
        setCritHits([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="regroup-loading">Loading Critical Hits...</div>;
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Critical Hits</h1>
        <p>
          Deadly and cinematic results of extreme damage. Each entry details the roll range, effects, and Glory bonuses you can apply.
        </p>
      </div>

      {critHits.length === 0 ? (
        <p className="no-results">No critical hit results found.</p>
      ) : (
        <div className="regroup-grid">
          {critHits.map((crit) => (
            <div key={crit.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{crit.name}</h3>
              </div>

              {crit.roll_range && (
                <p className="regroup-notes">
                  <strong>Roll Range:</strong> {crit.roll_range}
                </p>
              )}

              <p className="regroup-desc">{crit.description || "No description available."}</p>

              {crit.effect && (
                <div className="options-section">
                  <h4>Effect</h4>
                  <p className="option-effect">{crit.effect}</p>
                </div>
              )}

              {crit.glory_effect && (
                <div className="options-section">
                  <h4>Glory Effect</h4>
                  <p className="option-effect">{crit.glory_effect}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
