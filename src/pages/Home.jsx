import { Link } from "react-router-dom";
import Archives from "./Archives";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Wrath & Glory Database</h1>
        <p className="hero-subtitle">
          Thank you Cam for all the work on this Campaign!
        </p>
      </section>

      <section className="info-section">
        <h2>Campaigns</h2>
        <div className="feature-card">
          <h3>Chalnath Expanse</h3>
          <p>A story about 3 humans and a kroot that fucked around and found out.</p>
          <Link to="/campaign" className="link-blue">
            View Campaign →
          </Link>
        </div>
      </section>

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
            <h3>Combat System</h3>
            <p>
              Access a comprehensive library of Wrath & Glory combat mechanics — actions,
              options, modifiers, conditions, criticals, and environmental hazards.
            </p>
            <Link to="/combat" className="link-blue">
              Explore →
            </Link>
          </div>
        </div>

        <div className="archives-link-container">
          <Link to="/archives" className="modern-btn archives-btn">
            View the Full Archives →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
