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

  const getPdfName = (sourcePage) => {
    // Map of short source labels to actual PDF filenames
    const map = {
      "Core": "CB72600_WG_Corebook_Ver_3.pdf",
      "Apocrypha": "Wrath & Glory - An Abundance of Apocrypha v9 - Copy.pdf",
      "Ascension": "AscensionCompendiumv1.pdf",
      "Regroup": "Apocryphal Appendices - Regroup Actions v1 (3).pdf",
      "Combat": "Combat Quick Reference.pdf",
      "Campaign": "Chalnath Expanse Campaign.pdf",
      "Redacted Records": "WG_Redacted_Records_II_230720.pdf"
    };

    // Determine which PDF name to use
    let pdfFile = "CB72600_WG_Corebook_Ver_3.pdf"; // default
    for (const key in map) {
      if (sourcePage.toLowerCase().includes(key.toLowerCase())) {
        pdfFile = map[key];
        break;
      }
    }

    // Extract page number from something like "Core p.145" or "Apocrypha 27"
    const match = sourcePage.match(/(\d+)/);
    const pageNumber = match ? parseInt(match[1], 10) : null;

    // Build URL for the PDF file in /public/reference
    let url = `/reference/${pdfFile}`;
    if (pageNumber) url += `#page=${pageNumber}`;

    return url;
  };

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
                <th onClick={() => handleSort("source_page")}>
                  Source{" "}
                  {sortKey === "source_page" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
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
                  <td>
                    {talent.source_page ? (
                      <a
                        href={getPdfName(talent.source_page)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                        onClick={(e) => e.stopPropagation()} // prevent modal trigger
                      >
                        {talent.source_page}
                      </a>
                    ) : (
                      "—"
                    )}
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
