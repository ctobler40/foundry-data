import { Link } from "react-router-dom";

function Campaign({ campaign, planets }) {
  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="campaign-page" style={{ textAlign: "center", color: "#fff" }}>
      {/* -------------------- OVERVIEW SECTION -------------------- */}
      <section className="hero-section">
        <h1 className="hero-title">{campaign.title}</h1>
        <p className="hero-subtitle">{campaign.description}</p>
      </section>

      {/* -------------------- CURRENT MEMBERS -------------------- */}
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

      {/* -------------------- PLANETS SECTION -------------------- */}
      <section className="info-section" style={{ marginTop: "3rem" }}>
        <h2>Discovered Planets</h2>
        <p>Explore the key worlds within the Chalnath Expanse.</p>

        {planets && planets.length > 0 ? (
          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            {planets.map((planet) => (
              <Link
                key={planet.id}
                to={`/campaign/${planet.name.toLowerCase()}`}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                <div
                  className="feature-card"
                  style={{
                    background: "#1e1e1e",
                    borderRadius: "12px",
                    padding: "1rem",
                    boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(77,166,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(0,0,255,0.2)";
                  }}
                >
                  <h3 style={{ color: "#4da6ff" }}>{planet.name}</h3>
                  <p>{planet.details ? planet.details.slice(0, 120) + "..." : "View details"}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "1rem" }}>No planets available yet.</p>
        )}
      </section>
    </div>
  );
}

export default Campaign;
