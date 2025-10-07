import { Link } from "react-router-dom";

export default function Combat() {
  const sections = [
    {
      title: "Combat Actions",
      description: "Primary actions taken during combat such as attacking, aiming, charging, and more.",
      link: "/combat/actions",
    },
    {
      title: "Combat Options",
      description: "Modifiers and tactical choices like Called Shot, All-Out Attack, and Pinning Fire.",
      link: "/combat/options",
    },
    {
      title: "Attack Modifiers",
      description: "Environmental and situational modifiers that adjust DN or accuracy.",
      link: "/combat/modifiers",
    },
    {
      title: "Combat Conditions",
      description: "Status effects such as Bleeding, Fear, Exhaustion, or Poisoned that impact gameplay.",
      link: "/combat/conditions",
    },
    {
      title: "Combat Reference Guide",
      description: "A summarized index of quick-reference combat rules and tables.",
      link: "/combat/references",
    },
    {
      title: "Critical Hits",
      description: "Powerful and cinematic effects of successful Wrath critical strikes.",
      link: "/combat/critical-hits",
    },
    {
      title: "Combat Complications",
      description: "When fate turns sour — fumbles, jams, and misfortunes during combat.",
      link: "/combat/complications",
    },
    {
      title: "Environmental Hazards",
      description: "The dangers of fire, radiation, vacuum, and other hostile conditions.",
      link: "/combat/environmental-hazards",
    },
  ];

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Combat Overview</h1>
        <p>
          Explore all rules and reference materials for Wrath & Glory combat. Each section covers core mechanics,
          modifiers, and environmental effects that define battles in the 41st Millennium.
        </p>
      </div>

      <div className="regroup-grid">
        {sections.map((s) => (
          <Link to={s.link} key={s.title} className="link-blue" style={{ textDecoration: "none" }}>
            <div className="feature-card">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button className="modern-btn" style={{ marginTop: "1rem" }}>
                View Section
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
