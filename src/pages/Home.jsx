import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Wrath & Glory Database</h1>
        <p className="hero-subtitle">
          Thank you Cam for all the work on this Campaign!
        </p>
      </section>

      <section className="info-section">
        <div className="feature-card">
          <h3>Campaign</h3>
          <p>Learn about the Kalidonia campaign and its factions.</p>
          <Link to="/campaign" className="link-blue">
            View Campaign →
          </Link>
        </div>
      </section>

      {/* FAFO Party */}
      <section className="info-section">
        <h2>FAFO</h2>
        <p>
          Here we follow the group of FAFO — a small band of people (and one persistent Kroot)
          who constantly find themselves knee-deep in trouble.
        </p>

        <h3>Current Members</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="/images/kroot.png" alt="Hrellik" className="character-image" />
            <h3>Hrellik Orchik</h3>
            <p>
              A Kroot mercenary torn between primal instinct and flashes of Tau logic,
              wandering Nikonova in search of purpose.
            </p>
          </div>

          <div className="feature-card">
            <img src="/images/kaleson.png" alt="Kaleson" className="character-image" />
            <h3>Kaleson Van Der Hildr</h3>
            <p>
              A loudmouthed scribe from the Wieder Imperium whose charm and ego
              often land the party in chaos.
            </p>
          </div>

          <div className="feature-card">
            <img src="/images/agnes.png" alt="Agnes" className="character-image" />
            <h3>Agnes Grimm</h3>
            <p>
              A stealthy rebel teaching Je’lichi techniques, quick with her wit and slower to trust.
            </p>
          </div>

          <div className="feature-card">
            <img src="/images/dahlia.png" alt="Dahlia" className="character-image" />
            <h3>Dahlia Garakis</h3>
            <p>
              A hard-drinking fighter from the Renegade House whose humor masks deep scars.
            </p>
          </div>

          <div className="feature-card">
            <img src="/images/joe.png" alt="Joe Graves" className="character-image" />
            <h3>Sgt. Joe Graves</h3>
            <p>
              A Sordin PDF trooper driven by duty and guilt, last seen missing in the chaos of Nikonova.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/characters" className="modern-btn">
            View All Characters
          </Link>
        </div>
      </section>

      {/* Archives Overview */}
      <section className="info-section">
        <h2>Discover the Archives</h2>
        <p>
          The Wrath & Glory Database is a digital archive dedicated to the campaigns,
          talents, and stories forged within the grim darkness of the 41st millennium.
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

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Wrath & Glory Foundry Data</p>
      </footer>
    </div>
  );
}

export default Home;
