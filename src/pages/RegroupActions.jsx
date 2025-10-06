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

  if (loading) return <p>Loading Regroup Actions...</p>;

  return (
    <div className="page-container">
      <h2 className="page-title">Regroup Actions</h2>
      <div className="regroup-grid">
        {actions.map((a) => (
          <div key={a.id} className="regroup-card">
            <h3>{a.name}</h3>
            <p>{a.description}</p>
            {a.options && a.options.length > 0 && (
              <div className="options-section">
                <h4>Options:</h4>
                <ul>
                  {a.options.map((opt) => (
                    <li key={opt.id}>
                      <strong>{opt.title}:</strong> {opt.effect}
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
