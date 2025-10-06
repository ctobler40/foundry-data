import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function RegroupActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/regroupActions`)
      .then((res) => res.json())
      .then((data) => {
        setActions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="regroup-loading">
        <p>Loading Regroup Actions...</p>
      </div>
    );

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Regroup Actions</h1>
        <p>
          During any Regroup, each agent may perform one of the following
          actions to restore, prepare, or recover before the next mission.
        </p>
      </div>

      <div className="regroup-grid">
        {actions.map((a) => (
          <div key={a.id} className="regroup-card">
            <div className="regroup-title-bar">
              <h3>{a.name}</h3>
            </div>
            <p className="regroup-desc">{a.description}</p>
            {a.notes && <p className="regroup-notes">{a.notes}</p>}

            {a.options && a.options.length > 0 && (
              <div className="options-section">
                <h4>Available Options</h4>
                <ul className="option-list">
                  {a.options.map((opt) => (
                    <li key={opt.id} className="option-item">
                      <span className="option-title">{opt.title}</span>
                      <span className="option-effect">{opt.effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
