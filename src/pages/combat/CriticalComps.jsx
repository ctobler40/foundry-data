import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CriticalComps() {
  const [comps, setComps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/combatComps`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComps(data);
        else setComps([]);
        setLoading(false);
      })
      .catch(() => {
        setComps([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="regroup-loading">Loading Combat Complications...</div>;
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Complications</h1>
        <p>
          Mishaps and setbacks that occur when a Wrath Die turns against you. Each entry lists the roll range, effect, and any recovery test required.
        </p>
      </div>

      {comps.length === 0 ? (
        <p className="no-results">No combat complications found.</p>
      ) : (
        <div className="regroup-grid">
          {comps.map((c) => (
            <div key={c.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{c.name}</h3>
              </div>

              {c.roll_range && (
                <p className="regroup-notes">
                  <strong>Roll Range:</strong> {c.roll_range}
                </p>
              )}

              <p className="regroup-desc">{c.description || "No description available."}</p>

              {c.test_required && (
                <div className="options-section">
                  <h4>Test Required</h4>
                  <p className="option-effect">{c.test_required}</p>
                </div>
              )}

              {c.dn_example && (
                <p className="regroup-notes">
                  <strong>Example DN:</strong> {c.dn_example}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
