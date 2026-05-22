import { useState } from "react";

function TabletopKroot() {
  const [activePhase, setActivePhase] = useState("Command");
  const [isYourTurn, setIsYourTurn] = useState(true);

  const phases = ["Command", "Move", "Shoot", "Charge", "Combat"];

  const availableUnits = [
    "Kroot Carnivores",
    "Kroot Farstalkers",
    "Kroot Hounds",
    "Krootox Riders",
    "Krootox Rampagers",
    "Kroot Trail Shaper",
    "Kroot Flesh Shaper",
    "Kroot War Shaper",
    "Kroot Lone-Spear",
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Kroot Tabletop</h1>
        <p className="hero-subtitle">
          Track phases, turns, and available Kroot units.
        </p>
      </section>

      <section className="info-section">
        <h2>Current Phase: {activePhase}</h2>

        <div className="tabletop-phase-grid">
            {phases.map((phase) => (
                <button
                key={phase}
                type="button"
                onClick={() => setActivePhase(phase)}
                className={`modern-btn ${
                    activePhase === phase ? "phase-btn-active" : ""
                }`}
                >
                {phase}
                </button>
            ))}
            <label className="turn-switch">
                <input
                type="checkbox"
                checked={isYourTurn}
                onChange={() => setIsYourTurn((prev) => !prev)}
                />
                <span>{isYourTurn ? "Your Turn" : "Opponent's Turn"}</span>
            </label>
        </div>
      </section>

      <section className="info-section">
        <h2>Available Units</h2>

        <div className="feature-grid">
          {availableUnits.map((unit) => (
            <div key={unit} className="feature-card">
              <h3>{unit}</h3>
              <p>Unit details will be added from the database later.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TabletopKroot;