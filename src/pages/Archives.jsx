import { Link } from "react-router-dom";

function Archives() {
  return (
    <div className="home-container">
      <section className="info-section">
        <h2>Discover the Archives</h2>
        <p>
          The Wrath & Glory Database is a digital archive dedicated to the campaigns,
          talents, regroup actions, and stories forged within the grim darkness of the 41st millennium.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Talents</h3>
            <p>Browse the full collection of combat, technical, and social talents.</p>
            <Link to="/talents" className="link-blue">
              Explore →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Regroup Actions</h3>
            <p>Review the tactical regroup actions available to agents between missions.</p>
            <Link to="/regroup-actions" className="link-blue">
              Explore →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Abilities</h3>
            <p>(Coming soon) Discover Psyker powers, Faith abilities, and faction-specific boons.</p>
            <span className="coming-soon">Coming Soon</span>
          </div>

          <div className="feature-card">
            <h3>Lore Index</h3>
            <p>(Coming soon) Dive into the lore and data entries gathered from your campaigns.</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Archives;
