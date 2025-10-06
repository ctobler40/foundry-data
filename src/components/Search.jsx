import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { SEARCH_ENDPOINTS } from "../config/searchEndPoints";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const allData = await Promise.all(
            SEARCH_ENDPOINTS.map(async (e) => {
                const res = await fetch(e.url);
                const data = await res.json();
                return { category: e.name, path: e.path, data };
            })
        );

        const filtered = [];

        allData.forEach(({ category, data, path }) => {
          let matchCount = 0;

          if (Array.isArray(data)) {
            data.forEach((item) => {
              const text = JSON.stringify(item).toLowerCase();
              const matches = text.match(new RegExp(query, "g"));
              if (matches) matchCount += matches.length;
            });
          } else if (typeof data === "object" && data !== null) {
            const text = JSON.stringify(data).toLowerCase();
            const matches = text.match(new RegExp(query, "g"));
            if (matches) matchCount += matches.length;
          }

          if (matchCount > 0) {
            filtered.push({
              category,
              path,
              count: matchCount,
            });
          }
        });

        setResults(filtered);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }

    if (query) fetchAllData();
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      <p>
        Showing results for: <span className="search-query">"{query}"</span>
      </p>

      {results.length === 0 ? (
        <p className="no-results">No matches found.</p>
      ) : (
        <div className="search-results">
          {results.map((r, idx) => (
            <Link to={r.path} key={idx} className="search-card-link">
              <div className="search-card">
                <h3>{r.category}</h3>
                <p className="match-count">
                  Found <strong>{r.count}</strong>{" "}
                  {r.count === 1 ? "match" : "matches"} in this section.
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
