// pages/timeline/TimelineMap.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "./Timeline";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

// Stable pseudo-random (deterministic) in [0,1) based on a numeric seed
function seededRand(seed) {
  let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 16;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 2 ** 32;
}

// Place planets in a spiral ring layout (stable per id)
function computePlanetPosition(id, width, height) {
  const r = Math.min(width, height) * 0.4;
  const t = seededRand(id) * Math.PI * 2;
  const ring = 0.2 + seededRand(id + 17) * 0.8;
  const x = width / 2 + Math.cos(t) * r * ring;
  const y = height / 2 + Math.sin(t) * r * ring;
  return { x, y };
}

export default function TimelineMap() {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [size, setSize] = useState({ w: 1200, h: 700 });
  const [stars] = useState(() => {
    // Generate ~120 stars randomly placed with depth/size variation
    const arr = [];
    for (let i = 0; i < 120; i++) {
      arr.push({
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 6 + 4,
        driftX: (Math.random() - 0.5) * 2,
        driftY: (Math.random() - 0.5) * 2,
      });
    }
    return arr;
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pl, ss] = await Promise.all([
          fetch(`${API_URL}api/campaign/planets`).then((r) => r.json()),
          fetch(`${API_URL}api/sessions`).then((r) => r.json()).catch(() => []),
        ]);
        setPlanets(pl || []);
        setSessions(ss || []);
      } catch (e) {
        console.error("Error loading map data:", e);
      }
    };
    fetchAll();

    const onResize = () => {
      const w = Math.max(900, Math.min(window.innerWidth - 80, 1600));
      const h = Math.max(500, Math.min(window.innerHeight - 200, 900));
      setSize({ w, h });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sessionCounts = useMemo(() => {
    const map = new Map();
    for (const s of sessions) {
      if (!s?.planet_id) continue;
      map.set(s.planet_id, (map.get(s.planet_id) || 0) + 1);
    }
    return map;
  }, [sessions]);

  return (
    <div className="page-container">
      <h1 className="page-title">Chalnath Expanse — Timeline Events</h1>

      <div
        className="starmap-wrap"
        style={{
          width: size.w,
          height: size.h,
          margin: "0 auto",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at center, #0a0f1c 0%, #05070c 60%, #03040a 100%)",
          boxShadow: "0 6px 30px rgba(0,0,0,0.6)",
        }}
      >
        {/* Animated starfield background */}
        <div
          className="starfield"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {stars.map((s, i) => (
            <div
              key={i}
              className="star"
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: "50%",
                background: "white",
                opacity: s.opacity,
                filter: "blur(0.5px)",
                animation: `twinkle ${s.duration}s ease-in-out infinite, drift ${
                  s.duration * 3
                }s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                "--drift-x": `${s.driftX}px`,
                "--drift-y": `${s.driftY}px`,
              }}
            ></div>
          ))}
        </div>

        {/* Planet markers */}
        {planets.map((p) => {
          const { x, y } = computePlanetPosition(p.id, size.w, size.h);
          const count = sessionCounts.get(p.id) || 0;

          let planetColor =
            "radial-gradient(circle at 35% 35%, #8ec5ff, #1a3b72 60%, #0b1f46 100%)";
          if (p.name.toLowerCase().includes("kalidonia"))
            planetColor =
              "radial-gradient(circle at 35% 35%, #1e5b33, #0f3a1f 70%, #04140a 100%)";
          else if (p.name.toLowerCase().includes("haephos"))
            planetColor =
              "radial-gradient(circle at 35% 35%, #a8d8ff, #4aa3ff 60%, #0e285c 100%)";

          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: x - 10,
                top: y - 10,
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <button
                className="planet-dot"
                title={`${p.name} — ${count} session${count === 1 ? "" : "s"}`}
                onClick={() => navigate(`/timeline/planet/${p.id}`)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "1px solid rgba(180,220,255,0.9)",
                  background: planetColor,
                  boxShadow:
                    "0 0 8px rgba(130,190,255,0.9), 0 0 24px rgba(60,130,255,0.5)",
                  cursor: "pointer",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.25)";
                  const label = e.currentTarget.nextSibling;
                  if (label) label.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  const label = e.currentTarget.nextSibling;
                  if (label) label.style.opacity = "0";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  background: "rgba(10,15,28,0.8)",
                  color: "#cfe6ff",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 150ms ease",
                }}
              >
                {p.name}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 8,
            color: "#cfe6ff",
            fontSize: 12,
            opacity: 0.8,
            padding: "6px 10px",
            borderRadius: 8,
            background: "rgba(8,14,28,0.6)",
            border: "1px solid rgba(160,200,255,0.2)",
            zIndex: 2,
          }}
        >
          Click a planet to view its sessions
        </div>

        <style>
          {`
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.3); }
            }
            @keyframes drift {
              0% { transform: translate(0, 0); }
              50% { transform: translate(var(--drift-x), var(--drift-y)); }
              100% { transform: translate(0, 0); }
            }
          `}
        </style>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Timeline />
      </div>
    </div>
  );
}
