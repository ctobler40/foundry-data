import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Talents from "./pages/Talents";
import Talent from "./components/Talent";
import Characters from "./pages/Characters";
import Campaign from "./pages/Campaign";
import Navbar from "./components/Navbar";
import RegroupActions from "./pages/RegroupActions";
import Archives from "./pages/Archives";
import Footer from "./components/Footer";
import Search from "./components/Search";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function App() {
  const [talents, setTalents] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [factions, setFactions] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}api/talents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTalents(data);
        else setTalents([]);
      })
      .catch(() => setTalents([]));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}api/characters`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCharacters(data);
        else setCharacters([]);
      })
      .catch(() => setCharacters([]));
  }, []);

  useEffect(() => {
    async function loadCampaignData() {
      try {
        const [c, f, p, g] = await Promise.all([
          fetch(`${API_URL}api/campaign`).then((r) => r.json()),
          fetch(`${API_URL}api/campaign/factions`).then((r) => r.json()),
          fetch(`${API_URL}api/campaign/planets`).then((r) => r.json()),
          fetch(`${API_URL}api/campaign/groups`).then((r) => r.json()),
        ]);
        setCampaign(c);
        setFactions(f);
        setPlanets(p);
        setGroups(g);
      } catch (err) {
        console.error("Error fetching campaign data:", err);
      }
    }
    loadCampaignData();
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
            <Route
              path="/characters"
              element={<Characters characters={characters} />}
            />
            <Route
              path="/campaign"
              element={
                <Campaign
                  campaign={campaign}
                  factions={factions}
                  planets={planets}
                  groups={groups}
                />
              }
            />
            <Route path="/regroup-actions" element={<RegroupActions />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
