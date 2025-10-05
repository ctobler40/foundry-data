import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Talents from "./pages/Talents";
import Talent from "./components/Talent";
import Navbar from "./components/Navbar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function App() {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}api/talents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTalents(data);
        else setTalents([]);
      })
      .catch((err) => {
        console.error("Error fetching talents:", err);
        setTalents([]);
      });
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/talents" element={<Talents talents={talents} />} />
            <Route path="/talent/:id" element={<Talent talents={talents} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>© {new Date().getFullYear()} Wrath & Glory Foundry Data</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
