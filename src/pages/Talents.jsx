import { useState, useMemo } from "react";
import Talent from "../components/Talent";

function Talents({ talents }) {
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Compute filtered and sorted talents (always declared before return)
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

  // ✅ Now handle rendering logic
  if (!talents || talents.length === 0) {
    return (
      <div className="talents-loading">
        <h2>Loading Talents...</h2>
        <p>Please wait while we fetch data from the database.</p>
      </div>
    );
  }

  return (
    <div className="talents-page">
      <div className="talents-header">
        <h1>All Talents</h1>
        <p className="subtitle">
          A complete list of Wrath & Glory talents. Click a talent to view details.
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
        <p>No talents found matching your search.</p>
      ) : (
        <table className="talent-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("xp_cost")}>
                XP Cost {sortKey === "xp_cost" && (sortOrder === "asc" ? "▲" : "▼")}
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
      )}

      {selectedTalent && (
        <Talent
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
        />
      )}
    </div>
  );
}

export default Talents;
