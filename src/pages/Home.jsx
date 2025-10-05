import { Link } from "react-router-dom";

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
        <h2>Discover the Archives</h2>
        <p>The Wrath & Glory Database is a digital archive dedicated to the campaigns, talents, and stories forged within the grim darkness of the 41st millennium.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Talents</h3>
            <p>Browse the full collection of combat, technical, and social talents.</p>
            <Link to="/talents" className="link-blue">
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

      <section className="info-section">
        <h2>FAFO</h2>
        <p>Here, we follow the group of FAFO. A small group of people (and kroot) who constantly find a way to get themselves in a heap of shit.</p>

        <h3>Current Members</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Hrellik Orchik</h3>
              <p>
                A lone Kroot mercenary who awoke in the undercity of Nikonova with no
                memory of how he arrived. Driven by instinct and fragmented recollections
                of past hunts, Hrellik walks the line between survival and savagery.
              </p>
              <img
                src="/images/kroot.png"
                alt="Hrellik"
                className="character-image"
              />
              <Link to="/talents" className="link-blue">
                Explore →
              </Link>
            </div>
          </div>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Wrath & Glory Foundry Data</p>
      </footer>
    </div>
  );
}

export default Home;
