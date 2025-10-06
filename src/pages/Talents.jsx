import { useState, useMemo } from "react";
import Talent from "../components/Talent";

export default function Talents({ talents }) {
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredTalents = useMemo(() => {
    if (!Array.isArray(talents)) return [];

    const filtered = talents.filter((talent) =>
      talent.name.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      let valA = a[sortKey] || "";
      let valB = b[sortKey] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [talents, search, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (!talents || talents.length === 0) {
    return (
      <div className="talents-loading">
        <p>Loading Talents...</p>
      </div>
    );
  }

  return (
    <div className="talents-page">
      <div className="talents-header">
        <h1>Talents Index</h1>
        <p>
          A complete record of every known Wrath & Glory talent. Study the
          abilities and discover your path to power.
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search talents by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="modern-input"
          />
        </div>
      </div>

      {filteredTalents.length === 0 ? (
        <p className="no-results">No talents found matching your search.</p>
      ) : (
        <div className="talent-table-container">
          <table className="talent-table styled-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("xp_cost")}>
                  XP {sortKey === "xp_cost" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("requirements")}>
                  Requirements{" "}
                  {sortKey === "requirements" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalents.map((talent) => (
                <tr
                  key={talent.id}
                  onClick={() => setSelectedTalent(talent)}
                  className="talent-row"
                >
                  <td className="talent-name">{talent.name}</td>
                  <td>{talent.xp_cost ?? "—"}</td>
                  <td>{talent.requirements || "—"}</td>
                  <td className="talent-effect">
                    {talent.effect?.length > 80
                      ? talent.effect.substring(0, 80) + "..."
                      : talent.effect}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTalent && (
        <Talent talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
      )}
    </div>
  );
}
