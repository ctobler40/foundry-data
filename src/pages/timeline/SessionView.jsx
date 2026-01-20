// pages/timeline/SessionView.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function toImperialDate(session) {
  if (!session || isNaN(session)) return "";
  const fraction = session.toString().padStart(3, "0");
  const millennium = 42;
  const accuracy = 3;
  return `${accuracy}.${fraction}.M${millennium}`;
}

function CharacterChips({ ids, byId }) {
  const list = Array.isArray(ids) ? ids : [];
  if (list.length === 0) return <span>—</span>;

  return (
    <span style={chipRow}>
      {list.map((raw) => {
        const id = Number(raw);
        const c = byId.get(id);
        const name = c?.name || `#${id}`;

        return (
          <span key={String(id)} style={chip} title={c ? `${c.name} (#${c.id})` : `Character ${id}`}>
            <span style={{ opacity: 0.95 }}>{name}</span>
            {c?.status && <span style={chipMeta}>{c.status}</span>}
            {c?.characterImportance && <span style={chipMeta}>{c.characterImportance}</span>}
          </span>
        );
      })}
    </span>
  );
}

export default function SessionView() {
  const { id } = useParams(); // session id
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionRes, charsRes] = await Promise.all([
          fetch(`${API_URL}api/sessions/${id}`),
          fetch(`${API_URL}api/characters`).catch(() => null),
        ]);

        const sessionData = await sessionRes.json();

        if (!sessionRes.ok) {
          throw new Error(sessionData?.error || `Request failed: ${sessionRes.status}`);
        }

        let charsData = [];
        if (charsRes) {
          charsData = await charsRes.json().catch(() => []);
        }

        setSession(sessionData);
        setCharacters(Array.isArray(charsData) ? charsData : []);
      } catch (e) {
        console.error("Error loading session:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const charactersById = useMemo(() => {
    const m = new Map();
    (characters || []).forEach((c) => m.set(Number(c.id), c));
    return m;
  }, [characters]);

  if (loading) return <div className="page-container"><p>Loading…</p></div>;
  if (!session) return <div className="page-container"><p>Session not found.</p></div>;

  const logs = session.logs || [];
  const events = (session.events || []).sort(
    (a, b) =>
      (a.event_session || 0) - (b.event_session || 0) ||
      a.id - b.id
  );

  return (
    <div className="page-container">
      <h1 className="page-title">
        Session {session.session_number}: {session.title}
      </h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button className="modern-btn" onClick={() => navigate(`/timeline/planet/${session.planet_id}`)}>
          Back to Planet
        </button>
        <button className="modern-btn" style={{ marginLeft: 8 }} onClick={() => navigate("/timeline")}>
          Chronological List
        </button>
        <button className="modern-btn" style={{ marginLeft: 8 }} onClick={() => navigate("/timeline/map")}>
          Starmap
        </button>
      </div>

      <div className="event-card alt" style={{ marginBottom: "1rem" }}>
        <div className="event-header">
          <span className="session-tag">
            {session.campaign_title || "Chalnath Expanse"}
          </span>
          <span className="imperial-badge">
            {session.planet_name || "Unknown World"}
          </span>
        </div>

        {session.summary && <p className="event-desc">{session.summary}</p>}

        {session.gm_notes && (
          <details style={{ marginTop: 6 }}>
            <summary style={{ cursor: "pointer" }}><strong>GM Notes</strong></summary>
            <p style={{ marginTop: 8 }}>{session.gm_notes}</p>
          </details>
        )}

        <div className="event-meta" style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 6 }}>
            <strong>Relationships Gained:</strong>{" "}
            <CharacterChips ids={session.relationships_gained} byId={charactersById} />
          </div>
          <div>
            <strong>Relationships Lost:</strong>{" "}
            <CharacterChips ids={session.relationships_lost} byId={charactersById} />
          </div>
        </div>
      </div>

      <div className="month-view">
        <h2 className="month-title">Timeline Events ({events.length})</h2>
        {events.length === 0 ? (
          <p className="no-events">No recorded events for this session.</p>
        ) : (
          events.map((ev, i) => (
            <div key={ev.id} className={`event-card ${i % 2 === 0 ? "alt" : ""}`}>
              <div className="event-header">
                <span className="imperial-badge">
                  {ev.imperial_code || toImperialDate(ev.event_session)}
                </span>
                <span className="session-tag">Session {ev.event_session ?? session.session_number}</span>
              </div>
              <h4 className="event-title">{ev.title}</h4>
              <p className="event-desc">{ev.description}</p>
              {ev.character_name && (
                <p className="event-meta">
                  <strong>Entered By:</strong> {ev.character_name}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="month-view" style={{ marginTop: "1.5rem" }}>
        <h2 className="month-title">Session Logs ({logs.length})</h2>
        {logs.length === 0 ? (
          <p className="no-events">No logs recorded.</p>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="event-card">
              <div className="event-header">
                <span className="session-tag">
                  {l.author_name ? `By ${l.author_name}` : "Unattributed"}
                </span>
                <span className="imperial-badge">
                  {new Date(l.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="event-desc" style={{ whiteSpace: "pre-wrap" }}>
                {l.log_entry}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---- tiny chip styles ----
const chipRow = {
  display: "inline-flex",
  flexWrap: "wrap",
  gap: "0.45rem",
  verticalAlign: "middle",
};

const chip = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.25rem 0.55rem",
  borderRadius: "999px",
  border: "1px solid rgba(0,210,255,0.16)",
  background: "rgba(0,210,255,0.06)",
  color: "#d4f1ff",
  fontWeight: 650,
  lineHeight: 1.2,
};

const chipMeta = {
  color: "#6f8ca3",
  fontSize: "0.82rem",
  fontWeight: 600,
};
