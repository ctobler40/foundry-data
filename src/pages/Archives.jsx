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
            <h3>Combat System</h3>
            <p>
              Access a comprehensive library of Wrath & Glory combat mechanics — actions,
              options, modifiers, conditions, criticals, and environmental hazards.
            </p>
            <Link to="/combat" className="link-blue">
              Explore →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Ascension Packages</h3>
            <p>
              Explore the seventeen homebrew faction-agnostic ascension packages, designed
              to fit campaigns across the Imperium, Xenos, and Chaos alike.
            </p>
            <Link to="/ascensions" className="link-blue">
              Explore →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Wargear</h3>
            <p>Weapon traits. Weapon upgrades, Ammo. Armor. Tools and Equipment.</p>
            <Link to="/wargear" className="link-blue">
              Explore →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Endeavors</h3>
            <p>Your character may live in a galaxy rife with horrors and unending conflict, but the perilous scenarios they face will eventually come to an end.</p>
            <span className="coming-soon">Coming Soon</span>
          </div>

          <div className="feature-card">
            <h3>Bestiary</h3>
            <p>The Warp-torn Gilead System is home to innumerate dangers; deranged warriors with advanced archeotech, monstrous xenos bioforms, and maddening otherworldly daemons.</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Archives;
