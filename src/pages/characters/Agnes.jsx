import { useEffect, useState } from "react";
import CharacterProfile from "../../components/CharacterProfile";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Agnes() {
  const [blessings, setBlessings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlessings = async () => {
      try {
        const res = await fetch(`${API_URL}api/blessings`);
        if (!res.ok) throw new Error("Failed to fetch blessings");
        const data = await res.json();
        setBlessings(data);
      } catch (err) {
        console.error("Error loading blessings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlessings();
  }, []);

  return (
    <>
      <CharacterProfile id={3} subtitle="The medic who defies orders to save lives." />

      <div className="resources-section" style={{ marginTop: "3rem" }}>
        <h2 style={{ textAlign: "center", color: "#ffb347" }}>Helpful Resources</h2>
        <p style={{ textAlign: "center", marginBottom: "1rem", color: "#bbb" }}>
          Collected prayers and blessings known to guide the faithful through crisis.
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Loading blessings...</p>
        ) : blessings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No blessings available.</p>
        ) : (
          <div className="blessings-list" style={{ display: "grid", gap: "1.5rem" }}>
            {blessings.map((b) => (
              <div
                key={b.id}
                className="blessing-card"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  padding: "1rem 1.5rem",
                  boxShadow: "0 0 10px rgba(255, 215, 0, 0.1)",
                }}
              >
                <h3 style={{ color: "#ffd700" }}>{b.name}</h3>
                <p style={{ color: "#ccc", marginBottom: "0.5rem" }}>{b.description}</p>

                {b.examples?.length > 0 && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "#fff" }}>Examples:</strong>
                    <ul style={{ color: "#aaa", marginLeft: "1rem" }}>
                      {b.examples.map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {b.effects?.length > 0 && (
                  <div>
                    <strong style={{ color: "#fff" }}>Effects:</strong>
                    <ul style={{ color: "#aaa", marginLeft: "1rem" }}>
                      {b.effects.map((ef, idx) => (
                        <li key={idx}>{ef}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
