import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const [factions, setFactions] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [groups, setGroups] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

  useEffect(() => {
    fetch(`${API_URL}api/campaign`).then(res => res.json()).then(setCampaign);
    fetch(`${API_URL}api/campaign/factions`).then(res => res.json()).then(setFactions);
    fetch(`${API_URL}api/campaign/planets`).then(res => res.json()).then(setPlanets);
    fetch(`${API_URL}api/campaign/groups`).then(res => res.json()).then(setGroups);
  }, []);

  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="campaign-page" style={{ textAlign: "center", color: "#fff" }}>
      <section className="hero-section">
        <h1 className="hero-title">{campaign.title}</h1>
        <p className="hero-subtitle">{campaign.description}</p>
      </section>

      <section className="info-section">
        <h2>Setting</h2>
        <p className="section-text">{campaign.setting}</p>
        <p className="section-text">{campaign.current_state}</p>
        <p className="section-text">{campaign.call_for_aid}</p>
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
          {planets.map((p) => (
            <div
              key={p.id}
              className="feature-card"
              style={{
                background: "#1e1e1e",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
              }}
            >
              <h2 style={{ color: "#4da6ff" }}>{p.name}</h2>
              <p>{p.details}</p>
              {p.population && <p><strong>Population:</strong> {p.population}</p>}
              {p.exports && <p><strong>Exports:</strong> {p.exports}</p>}
              {p.environment && <p><strong>Environment:</strong> {p.environment}</p>}
            </div>
          ))}
        </div>
        <h2>Other Groups</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {groups.map((g) => (
            <li key={g.id} style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#4da6ff" }}>{g.name}</strong>: {g.description}
            </li>
          ))}
        </ul>
      </section>

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
          {factions.map((f) => (
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
              {f.exports && <p><strong>Exports:</strong> {f.exports}</p>}
              {f.territory && <p><strong>Territory:</strong> {f.territory}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>FAFO</h2>
        <p>
          Here we follow the group of FAFO — a small band of people (and one persistent Kroot)
          who constantly find themselves knee-deep in trouble.
        </p>

        <h3>Current Members</h3>
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
          {[
            {
              name: "Hrellik Orchik",
              img: "/images/kroot.png",
              desc: "A Kroot mercenary torn between primal instinct and flashes of Tau logic, wandering Nikonova in search of purpose.",
            },
            {
              name: "Kaleson Van Der Hildr",
              img: "/images/kaleson.png",
              desc: "A loudmouthed scribe from the Wieder Imperium whose charm and ego often land the party in chaos.",
            },
            {
              name: "Agnes Grimm",
              img: "/images/agnes.png",
              desc: "A stealthy rebel teaching Je’lichi techniques, quick with her wit and slower to trust.",
            },
            {
              name: "Dahlia Garakis",
              img: "/images/dahlia.png",
              desc: "A hard-drinking fighter from the Renegade House whose humor masks deep scars.",
            },
            {
              name: "Sgt. Joe Graves",
              img: "/images/joe.png",
              desc: "A Sordin PDF trooper driven by duty and guilt, last seen missing in the chaos of Nikonova.",
            },
          ].map((char) => (
            <div
              key={char.name}
              className="feature-card"
              style={{
                background: "#1e1e1e",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
              }}
            >
              <img
                src={char.img}
                alt={char.name}
                className="character-image"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "0.5rem",
                }}
              />
              <h3 style={{ color: "#4da6ff" }}>{char.name}</h3>
              <p>{char.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/characters" className="modern-btn">
            View All Characters
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Campaign;
