import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6500";

function App() {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/talents`)
      .then((res) => res.json())
      .then((data) => setTalents(data))
      .catch((err) => console.error("Error fetching talents:", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wrath & Glory Talents</h1>
      </header>
      <main style={{ padding: "1rem" }}>
        {talents.length === 0 ? (
          <p>Loading talents...</p>
        ) : (
          <table className="talent-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>XP Cost</th>
                <th>Requirements</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              {talents.map((talent) => (
                <tr key={talent.id}>
                  <td style={{ fontWeight: "bold" }}>{talent.name}</td>
                  <td>{talent.xp_cost}</td>
                  <td>{talent.requirements || "—"}</td>
                  <td style={{ textAlign: "left" }}>{talent.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;
