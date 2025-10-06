import { useEffect, useState } from "react";

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
    <div className="campaign-page">
      <h1>{campaign.title}</h1>
      <p>{campaign.description}</p>

      <section>
        <h2>Setting</h2>
        <p>{campaign.setting}</p>
      </section>

      <section>
        <h2>Current State</h2>
        <p>{campaign.current_state}</p>
      </section>

      <section>
        <h2>Call for Aid</h2>
        <p>{campaign.call_for_aid}</p>
      </section>

      <section>
        <h2>Major Factions</h2>
        <div className="feature-grid">
          {factions.map(f => (
            <div key={f.id} className="feature-card">
              <h3>{f.name}</h3>
              <p>{f.description}</p>
              {f.exports && <p><strong>Exports:</strong> {f.exports}</p>}
              {f.territory && <p><strong>Territory:</strong> {f.territory}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Planets</h2>
        <div className="feature-grid">
          {planets.map(p => (
            <div key={p.id} className="feature-card">
              <h3>{p.name}</h3>
              <p>{p.details}</p>
              {p.population && <p><strong>Population:</strong> {p.population}</p>}
              {p.exports && <p><strong>Exports:</strong> {p.exports}</p>}
              {p.environment && <p><strong>Environment:</strong> {p.environment}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Other Groups</h2>
        <ul>
          {groups.map(g => (
            <li key={g.id}>
              <strong>{g.name}</strong>: {g.description}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Campaign;
