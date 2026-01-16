// pages/timeline/SessionView.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function toImperialDate(session) {
  if (!session || isNaN(session)) return "";
  const fraction = session.toString().padStart(3, "0");
  const millennium = 42;
  const accuracy = 3;
  return `${accuracy}.${fraction}.M${millennium}`;
}

export default function SessionView() {
  const { id } = useParams(); // session id
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}api/sessions/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || `Request failed: ${res.status}`);
        }

        console.log(data);
        setSession(data);
      } catch (e) {
        console.error("Error loading session:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-container"><p>Loading…</p></div>;
  if (!session) return <div className="page-container"><p>Session not found.</p></div>;

  const logs = session.logs || [];
  const events = (session.events || []).sort(
    (a, b) =>
      (a.imperial_code || "").localeCompare(b.imperial_code || "") ||
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
        <p className="event-meta" style={{ marginTop: 8 }}>
          <strong>Relationships Gained:</strong>{" "}
          {(session.relationships_gained || []).join(", ") || "—"} &nbsp;|&nbsp;
          <strong>Lost:</strong>{" "}
          {(session.relationships_lost || []).join(", ") || "—"}
        </p>
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
