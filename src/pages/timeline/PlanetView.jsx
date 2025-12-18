// pages/timeline/PlanetView.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Kalidonia from "../ChalnathLocations/Kalidonia";
import Haephos from "../ChalnathLocations/Haephos";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function PlanetView() {
  const { id } = useParams(); // planet id
  const navigate = useNavigate();

  const [planet, setPlanet] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [planetsRes, sessionsRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}api/campaign/planets`).then((r) => r.json()),
          fetch(`${API_URL}api/sessions`).then((r) => r.json()).catch(() => []),
          fetch(`${API_URL}api/timeline`).then((r) => r.json()).catch(() => []),
        ]);

        // Find this planet
        const foundPlanet =
          (planetsRes || []).find((p) => String(p.id) === String(id)) || null;
        setPlanet(foundPlanet);

        // Filter all events tied to this planet
        const planetEvents = (eventsRes || []).filter(
          (e) => String(e.related_planet) === String(id)
        );
        setEvents(planetEvents);

        // Determine which sessions appear on this planet
        const planetSessionIds = [
          ...new Set(
            planetEvents
              .map((e) => e.event_session)
              .filter((sid) => sid !== null && sid !== undefined)
          ),
        ];

        // Keep all sessions in memory to map event references
        setAllSessions(sessionsRes || []);

        // Match sessions by id
        const planetSessions = (sessionsRes || []).filter((s) =>
          planetSessionIds.includes(s.id)
        );
        setSessions(planetSessions);
      } catch (e) {
        console.error("Error loading planet view:", e);
      }
    };
    load();
  }, [id]);

  // --- Map events to their sessions
  const eventsBySession = useMemo(() => {
    const m = new Map();
    for (const ev of events) {
      const key = ev.event_session || "unslotted";
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(ev);
    }
    for (const [k, arr] of m) {
      arr.sort(
        (a, b) =>
          (a.imperial_code || "").localeCompare(b.imperial_code || "") ||
          a.id - b.id
      );
    }
    return m;
  }, [events]);

  // --- Orbital dots (only if Kalidonia)
  const orbitDots =
    planet?.name?.toLowerCase() === "kalidonia"
      ? [
          { name: "Nikonova", color: "#9ccaff", size: 12, orbit: 90 },
          // { name: "Rustbourne", color: "#caa84a", size: 10, orbit: 130 },
          // { name: "Duskfall", color: "#f06969", size: 8, orbit: 160 },
        ]
      : [];

  return (
    <>
      <div className="page-container">
        {/* <h1 className="page-title">
          {planet ? planet.name : "Planet"} — Sessions
        </h1> */}

        {/* ---------------- PLANET VISUAL ---------------- */}
        {planet && (
          <div
            className="planet-visual"
            style={{
              position: "relative",
              width: "320px",
              height: "320px",
              margin: "2rem auto",
            }}
          >
            {/* Main planet */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  planet.name?.toLowerCase() === "kalidonia"
                    ? "radial-gradient(circle at 35% 35%, #1e5b33, #0f3a1f 70%, #04140a 100%)"
                    : "radial-gradient(circle at 35% 35%, #8ec5ff, #1a3b72 60%, #0b1f46 100%)",
                boxShadow:
                  planet.name?.toLowerCase() === "kalidonia"
                    ? "0 0 40px rgba(40,255,100,0.4), inset 0 0 40px rgba(80,255,120,0.1)"
                    : "0 0 40px rgba(120,180,255,0.5), inset 0 0 40px rgba(80,130,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4f1ff",
                fontWeight: "600",
                fontSize: "1.3rem",
                textShadow: "0 0 8px rgba(0,0,0,0.7)",
                animation: "spinPlanet 60s linear infinite",
              }}
            >
              {planet.name}
            </div>

            {/* Orbiting sublocations */}
            {orbitDots.map((dot, i) => {
              const angle = (i * 120 * Math.PI) / 180;
              const orbitRadius = dot.orbit;
              const x = 160 + Math.cos(angle) * orbitRadius;
              const y = 160 + Math.sin(angle) * orbitRadius;
              return (
                <div
                  key={dot.name}
                  title={dot.name}
                  style={{
                    position: "absolute",
                    left: x - dot.size / 2,
                    top: y - dot.size / 2,
                    width: dot.size,
                    height: dot.size,
                    borderRadius: "50%",
                    background: dot.color,
                    boxShadow: `0 0 10px ${dot.color}, 0 0 20px ${dot.color}90`,
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></div>
              );
            })}
          </div>
        )}

        {/* ---------------- SESSION CARDS ---------------- */}
        <div className="month-view">
          <h2 className="month-title">
            {sessions.length > 0
              ? `Recorded Sessions on ${planet?.name}`
              : "No Sessions Recorded"}
          </h2>

          {sessions.length === 0 ? (
            <p className="no-events">
              No sessions recorded for this planet yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {sessions.map((s) => {
                const evs =
                  eventsBySession.get(s.id) ||
                  eventsBySession.get(s.session_number) ||
                  [];
                return (
                  <div
                    key={s.id}
                    className="event-card fade-in"
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => navigate(`/timeline/session/${s.id}`)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div className="event-header">
                      <span className="session-tag">
                        Session {s.session_number}
                      </span>
                      <span className="imperial-badge">
                        {s.campaign_title || "Chalnath Expanse"}
                      </span>
                    </div>
                    <h4 className="event-title">{s.title}</h4>
                    {s.summary && (
                      <p className="event-desc">
                        {s.summary.length > 160
                          ? s.summary.slice(0, 160) + "..."
                          : s.summary}
                      </p>
                    )}
                    <p className="event-meta">
                      <strong>Events:</strong> {evs.length} &nbsp;|&nbsp;
                      <strong>Logs:</strong>{" "}
                      {Array.isArray(s.logs) ? s.logs.length : 0}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>
          {`
            @keyframes spinPlanet {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
      {/* ---------------- PLANET INFO ---------------- */}
      {planet &&  (
        planet?.name?.toLowerCase() === "kalidonia" ? <Kalidonia /> : 
        planet?.name?.toLowerCase() === "haephos" ? <Haephos /> : <div></div>
      )}
    </>
  );
}
