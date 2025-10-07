import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Kalidonia() {
  const [campaign, setCampaign] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [factions, setFactions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}api/campaign`)
      .then((res) => res.json())
      .then(setCampaign)
      .catch(console.error);

    fetch(`${API_URL}api/campaign/planets`)
      .then((res) => res.json())
      .then(setPlanets)
      .catch(console.error);

    fetch(`${API_URL}api/campaign/factions`)
      .then((res) => res.json())
      .then(setFactions)
      .catch(console.error);
  }, []);

  if (!campaign) return <p>Loading location data...</p>;

  return (
    <div className="location-page" style={{ textAlign: "center", color: "#fff" }}>
      {/* -------------------- HEADER -------------------- */}
      <section className="hero-section">
        <h1 className="hero-title">Kalidonia</h1>
        <p className="hero-subtitle">
          Terra-like exoplanet located in the Septum III System — ravaged by centuries of war and noble conflict.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <Link to="/campaign" className="modern-btn">
            ← Back to Campaign Overview
          </Link>
        </div>
      </section>

      {/* -------------------- OVERVIEW -------------------- */}
      <section className="info-section">
        <h2>Overview</h2>
        <p className="section-text">{campaign.setting}</p>
        <p className="section-text">{campaign.current_state}</p>
        <p className="section-text">{campaign.call_for_aid}</p>
      </section>

      {/* -------------------- PLANET DETAILS -------------------- */}
      <section className="info-section">
        <h2>Planet Details</h2>
        {planets.length > 0 ? (
          planets
            .filter((p) => p.name === "Kalidonia")
            .map((p) => (
              <div
                key={p.id}
                className="feature-card"
                style={{
                  background: "#1e1e1e",
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
                }}
              >
                <h2 style={{ color: "#4da6ff" }}>{p.name}</h2>
                <p>{p.details}</p>
                {p.population && (
                  <p>
                    <strong>Population:</strong> {p.population}
                  </p>
                )}
                {p.exports && (
                  <p>
                    <strong>Exports:</strong> {p.exports}
                  </p>
                )}
                {p.environment && (
                  <p>
                    <strong>Environment:</strong> {p.environment}
                  </p>
                )}
              </div>
            ))
        ) : (
          <p>Loading planet details...</p>
        )}
      </section>

      {/* -------------------- FACTIONS -------------------- */}
      <section className="info-section">
        <h2>Major Factions</h2>
        <div
          className="feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {factions.length > 0 ? (
            factions.map((f) => (
              <div
                key={f.id}
                className="feature-card"
                style={{
                  background: "#1e1e1e",
                  borderRadius: "12px",
                  padding: "1rem",
                  boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
                }}
              >
                <h3 style={{ color: "#4da6ff" }}>{f.name}</h3>
                <p>{f.description}</p>
              </div>
            ))
          ) : (
            <p>Loading faction data...</p>
          )}
        </div>
      </section>
    </div>
  );
}
