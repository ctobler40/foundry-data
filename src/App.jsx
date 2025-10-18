import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import "./App.css";

// ----- Core Pages -----
import Home from "./pages/Home";
import Talents from "./pages/Talents";
import Talent from "./components/Talent";
import Characters from "./pages/Characters";
import Campaign from "./pages/Campaign";
import RegroupActions from "./pages/RegroupActions";
import Archives from "./pages/Archives";
import Ascensions from "./pages/Ascensions";
import Timeline from "./pages/Timeline";
import Kalidonia from "./pages/ChalnathLocations/Kalidonia";

// ----- Layout -----
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./components/Search";

// ----- Combat System Pages -----
import Combat from "./pages/Combat";
import CombatActions from "./pages/combat/CombatActions";
import CombatOptions from "./pages/combat/CombatOptions";
import AttackModifiers from "./pages/combat/AttackModifiers";
import Conditions from "./pages/combat/Conditions";
import CombatRefs from "./pages/combat/CombatRefs";
import CriticalHits from "./pages/combat/CriticalHits";
import CriticalComps from "./pages/combat/CriticalComps";
import EnvironmentHazards from "./pages/combat/EnvironmentHazards";

// ----- FAFO Character Pages -----
import Hrellik from "./pages/characters/Hrellik";
import Kaleson from "./pages/characters/Kaleson";
import Agnes from "./pages/characters/Agnes";
import Joe from "./pages/characters/Joe";
import Dahlia from "./pages/characters/Dahlia";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

// ----- Character Router Wrapper -----
function FAFOCharacterRouter() {
  const { name } = useParams();
  const lower = name?.toLowerCase();

  switch (lower) {
    case "hrellik":
      return <Hrellik />;
    case "kaleson":
      return <Kaleson />;
    case "agnes":
      return <Agnes />;
    case "joe":
      return <Joe />;
    case "dahlia":
      return <Dahlia />;
    default:
      return (
        <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
          Character not found.
        </div>
      );
  }
}

function App() {
  const [talents, setTalents] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [factions, setFactions] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [groups, setGroups] = useState([]);

  // Load Talents
  useEffect(() => {
    fetch(`${API_URL}api/talents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTalents(data);
        else setTalents([]);
      })
      .catch(() => setTalents([]));
  }, []);

  // Load Characters
  useEffect(() => {
    fetch(`${API_URL}api/characters`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCharacters(data);
        else setCharacters([]);
      })
      .catch(() => setCharacters([]));
  }, []);

  // Load Campaign Data
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
            {/* ----- Core Pages ----- */}
            <Route path="/" element={<Home />} />
            <Route path="/talents" element={<Talents talents={talents} />} />
            <Route path="/talent/:id" element={<Talent talents={talents} />} />
            <Route path="/characters" element={<Characters characters={characters} />} />

            {/* ----- Campaign ----- */}
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
            <Route path="/campaign/kalidonia" element={<Kalidonia />} />

            {/* ----- Archives & Reference Pages ----- */}
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/regroup-actions" element={<RegroupActions />} />
            <Route path="/ascensions" element={<Ascensions />} />

            {/* ----- Combat System Pages ----- */}
            <Route path="/combat" element={<Combat />} />
            <Route path="/combat/actions" element={<CombatActions />} />
            <Route path="/combat/options" element={<CombatOptions />} />
            <Route path="/combat/modifiers" element={<AttackModifiers />} />
            <Route path="/combat/conditions" element={<Conditions />} />
            <Route path="/combat/references" element={<CombatRefs />} />
            <Route path="/combat/critical-hits" element={<CriticalHits />} />
            <Route path="/combat/complications" element={<CriticalComps />} />
            <Route path="/combat/environmental-hazards" element={<EnvironmentHazards />} />

            {/* ----- FAFO Main Characters (Keep Original Route) ----- */}
            <Route path="/fafo/:name" element={<FAFOCharacterRouter />} />

            {/* ----- Search / Redirect ----- */}
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
