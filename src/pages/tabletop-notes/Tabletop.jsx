import { Link } from "react-router-dom";

function TabletopPage() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Tabletop</h1>
        <p className="hero-subtitle">
          Quick access to tabletop resources for your armies.
        </p>
      </section>

      <section className="info-section">
        <h2>Factions</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Kroot</h3>
            <p>Kroot tabletop resources, units, and rules.</p>
            <Link to="/tabletop/kroot" className="link-blue">
              View Kroot →
            </Link>
          </div>

          <div className="feature-card">
            <h3>T’au</h3>
            <p>T’au Empire tabletop resources, units, and rules.</p>
            <Link to="/tabletop/tau" className="link-blue">
              View T’au →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TabletopPage;