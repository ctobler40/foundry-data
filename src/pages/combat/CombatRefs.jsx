import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function CombatRefs() {
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/combatRefs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRefs(data);
        else setRefs([]);
        setLoading(false);
      })
      .catch(() => {
        setRefs([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="regroup-loading">Loading Combat References...</div>;
  }

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Reference Guide</h1>
        <p>
          A summarized index of core combat rules and modifiers for quick lookup during gameplay.
        </p>
      </div>

      {refs.length === 0 ? (
        <p className="no-results">No combat references found.</p>
      ) : (
        <div className="regroup-grid">
          {refs.map((r) => (
            <div key={r.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{r.topic}</h3>
              </div>

              {r.section && (
                <p className="regroup-notes">
                  <strong>Section:</strong> {r.section}
                </p>
              )}

              <p className="regroup-desc">{r.summary || "No summary available."}</p>

              {r.reference_page && (
                <p
                  className="regroup-notes"
                  style={{ color: "#777", fontSize: "0.85rem" }}
                >
                  <em>Source: Page {r.reference_page}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
