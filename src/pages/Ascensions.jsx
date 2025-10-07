import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Ascensions() {
  const [ascensions, setAscensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}api/ascensionPackages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAscensions(data);
        else setAscensions([]);
      })
      .catch(() => setAscensions([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredAscensions = ascensions.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="regroup-page">
      <div className="regroup-header">
        <h1>Ascension Packages</h1>
        <p>
          These represent the powerful transformations and narrative milestones
          available to agents who rise above the ordinary. Each package carries
          unique benefits, costs, and story implications drawn from the{" "}
          <em>Ascension Compendium</em>.
        </p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="modern-input"
          placeholder="Search Ascension Packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="regroup-loading">Loading Ascension Data...</div>
      ) : filteredAscensions.length === 0 ? (
        <p className="no-results">No Ascension Packages found.</p>
      ) : (
        <div className="regroup-grid">
          {filteredAscensions.map((asc) => (
            <div key={asc.id} className="regroup-card">
              <div className="regroup-title-bar">
                <h3>{asc.name}</h3>
                <p className="subtitle">{asc.tagline}</p>
              </div>

              <p className="regroup-desc">{asc.description}</p>

              {asc.xp_cost && (
                <div className="regroup-notes">
                  <strong>XP Cost:</strong> {asc.xp_cost}
                </div>
              )}

              {asc.keyword && (
                <div className="regroup-notes">
                  <strong>Keyword:</strong> {asc.keyword}
                </div>
              )}

              {asc.influence_bonus && (
                <div className="regroup-notes">
                  <strong>Influence Bonus:</strong> {asc.influence_bonus}
                </div>
              )}

              {asc.requirements && (
                <div className="regroup-notes">
                  <strong>Requirements:</strong> {asc.requirements}
                </div>
              )}

              {asc.story_element && (
                <div className="options-section">
                  <h4>Story Element</h4>
                  <p className="option-effect">{asc.story_element}</p>
                </div>
              )}

              {asc.example_usage && (
                <div className="options-section">
                  <h4>Example Usage</h4>
                  <p className="option-effect">{asc.example_usage}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
