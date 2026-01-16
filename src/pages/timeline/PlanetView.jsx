// pages/timeline/PlanetView.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Kalidonia from "../ChalnathLocations/Kalidonia";
import Haephos from "../ChalnathLocations/Haephos";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

  // ---------------- Modal + Form (styled like your screenshot) ----------------
  // ---- stable components (DO NOT define inside PlanetView) ----
function ModalShell({ title, children, onClose, formError }) {
  return (
    <div
      className="modal-overlay"
      style={overlayStyle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modalStyle}>
        <div style={modalHeader}>
          <div>
            <h3 style={modalTitle}>{title}</h3>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={closeBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.15)")}
          >
            ✕
          </button>
        </div>

        {formError && <div style={errorBox}>{formError}</div>}

        <div style={{ padding: "1rem" }}>{children}</div>
      </div>
    </div>
  );
}

function SessionForm({ form, setForm, onSubmit, submitLabel, closeModals, saving }) {
  return (
    <div style={{ display: "grid", gap: "0.9rem" }}>
      <div style={twoCol}>
        <div style={field}>
          <label style={labelStyle}>Session #</label>
          <input
            value={form.session_number}
            onChange={(e) => setForm((p) => ({ ...p, session_number: e.target.value }))}
            placeholder="e.g. 12"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.55)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
          />
        </div>

        <div style={field}>
          <label style={labelStyle}>Campaign Title</label>
          <input
            value={form.campaign_title}
            onChange={(e) => setForm((p) => ({ ...p, campaign_title: e.target.value }))}
            placeholder="Chalnath Expanse"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.55)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
          />
        </div>
      </div>

      <div style={field}>
        <label style={labelStyle}>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Session title"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.55)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
        />
      </div>

      <div style={field}>
        <label style={labelStyle}>Summary</label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
          placeholder="Short summary (optional)"
          rows={6}
          style={textareaStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.55)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
        />
      </div>

      <div style={actionsRow}>
        <button onClick={closeModals} disabled={saving} style={cancelBtn}>
          Cancel
        </button>
        <button onClick={onSubmit} disabled={saving} style={confirmBtn}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}

export default function PlanetView() {
  const { id } = useParams(); // planet id
  const navigate = useNavigate();

  const [planet, setPlanet] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  // ---- CRUD UI state
  const [showAdd, setShowAdd] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const emptyForm = {
    session_number: "",
    title: "",
    summary: "",
    campaign_title: "",
    logs: [],
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const [planetsRes, sessionsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}api/campaign/planets`).then((r) => r.json()),
        fetch(`${API_URL}api/sessions`).then((r) => r.json()).catch(() => []),
        fetch(`${API_URL}api/timeline`).then((r) => r.json()).catch(() => []),
      ]);

      const foundPlanet =
        (planetsRes || []).find((p) => String(p.id) === String(id)) || null;
      setPlanet(foundPlanet);

      const planetEvents = (eventsRes || []).filter(
        (e) => String(e.related_planet) === String(id)
      );
      setEvents(planetEvents);

      const planetSessionIds = [
        ...new Set(
          planetEvents
            .map((e) => e.event_session)
            .filter((sid) => sid !== null && sid !== undefined)
        ),
      ];

      setAllSessions(sessionsRes || []);

      // NOTE: your original code compares planetSessionIds to s.session_number.
      const planetSessions = (sessionsRes || []).filter((s) =>
        planetSessionIds.includes(s.session_number)
      );

      setSessions(planetSessions);
    } catch (e) {
      console.error("Error loading planet view:", e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ? [{ name: "Nikonova", color: "#9ccaff", size: 12, orbit: 90 }]
      : [];

  // ---------------- CRUD handlers ----------------
  const openAdd = () => {
    setFormError("");
    setForm(emptyForm);
    setShowAdd(true);
  };

  const openEdit = (s) => {
    setFormError("");
    setEditingSession(s);
    setForm({
      session_number: s.session_number ?? "",
      title: s.title ?? "",
      summary: s.summary ?? "",
      campaign_title: s.campaign_title ?? "",
      logs: Array.isArray(s.logs) ? s.logs : [],
    });
  };

  const closeModals = () => {
    setShowAdd(false);
    setEditingSession(null);
    setDeletingSession(null);
    setFormError("");
    setSaving(false);
  };

  const validateForm = () => {
    const sn = Number(form.session_number);
    if (!Number.isFinite(sn) || sn <= 0)
      return "Session number must be a positive number.";
    if (!String(form.title || "").trim()) return "Title is required.";
    return "";
  };

  const createSession = async () => {
    const err = validateForm();
    if (err) return setFormError(err);

    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`${API_URL}api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          session_number: Number(form.session_number),
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Create failed (${res.status})`);
      }

      closeModals();
      await load();
    } catch (e) {
      console.error(e);
      setFormError(e.message || "Failed to create session.");
      setSaving(false);
    }
  };

  const updateSession = async () => {
    if (!editingSession?.id) return;
    const err = validateForm();
    if (err) return setFormError(err);

    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`${API_URL}api/sessions/${editingSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          session_number: Number(form.session_number),
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Update failed (${res.status})`);
      }

      closeModals();
      await load();
    } catch (e) {
      console.error(e);
      setFormError(e.message || "Failed to update session.");
      setSaving(false);
    }
  };

  const deleteSession = async () => {
    if (!deletingSession?.id) return;

    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`${API_URL}api/sessions/${deletingSession.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Delete failed (${res.status})`);
      }

      closeModals();
      await load();
    } catch (e) {
      console.error(e);
      setFormError(e.message || "Failed to delete session.");
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-container">
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
                />
              );
            })}
          </div>
        )}

        {/* ---------------- SESSION CARDS ---------------- */}
        <div className="month-view">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
            }}
          >
            <h2 className="month-title" style={{ margin: 0 }}>
              {sessions.length > 0
                ? `Recorded Sessions on ${planet?.name}`
                : "No Sessions Recorded"}
            </h2>

            <button onClick={openAdd} style={confirmBtn}>
              + Add Session
            </button>
          </div>

          {sessions.length === 0 ? (
            <p className="no-events">No sessions recorded for this planet yet.</p>
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
                      position: "relative",
                      paddingTop: "2.25rem",
                    }}
                    onClick={() => navigate(`/timeline/session/${s.id}`)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {/* action buttons */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.6rem",
                        right: "0.6rem",
                        display: "flex",
                        gap: "0.4rem",
                        zIndex: 2,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Edit session"
                        onClick={() => openEdit(s)}
                        style={iconBtn}
                      >
                        ✎
                      </button>
                      <button
                        title="Delete session"
                        onClick={() => {
                          setFormError("");
                          setDeletingSession(s);
                        }}
                        style={{
                          ...iconBtn,
                          borderColor: "rgba(240,105,105,0.35)",
                        }}
                      >
                        🗑
                      </button>
                    </div>

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
      {planet &&
        (planet?.name?.toLowerCase() === "kalidonia" ? (
          <Kalidonia />
        ) : planet?.name?.toLowerCase() === "haephos" ? (
          <Haephos />
        ) : (
          <div />
        ))}

      {showAdd && (
  <ModalShell title="Add Session" onClose={closeModals} formError={formError}>
    <SessionForm
      form={form}
      setForm={setForm}
      onSubmit={createSession}
      submitLabel="Create Session"
      closeModals={closeModals}
      saving={saving}
    />
  </ModalShell>
)}

{editingSession && (
  <ModalShell
    title={`Update Session ${editingSession.session_number ?? ""}`}
    onClose={closeModals}
    formError={formError}
  >
    <SessionForm
      form={form}
      setForm={setForm}
      onSubmit={updateSession}
      submitLabel="Save Changes"
      closeModals={closeModals}
      saving={saving}
    />
  </ModalShell>
)}


      {/* ---------------- DELETE MODAL ---------------- */}
      {deletingSession && (
        <ModalShell title="Delete Session" onClose={closeModals}>
          <div style={{ padding: "0.1rem 0 0.4rem 0" }}>
            <p style={{ color: "#d4f1ff", marginTop: 0 }}>
              Delete <strong>Session {deletingSession.session_number}</strong> —
              “{deletingSession.title}”?
            </p>
            <p style={{ color: "#9fbad0", marginBottom: 0 }}>
              This will remove the session record. (If your timeline events
              reference this session, make sure your backend handles that
              cleanly.)
            </p>
          </div>

          <div style={actionsRow}>
            <button onClick={closeModals} disabled={saving} style={cancelBtn}>
              Cancel
            </button>
            <button
              onClick={deleteSession}
              disabled={saving}
              style={{
                ...confirmBtn,
                background: "linear-gradient(90deg, rgba(240,105,105,0.95), rgba(210,75,75,0.95))",
                boxShadow: "0 10px 24px rgba(240,105,105,0.18)",
              }}
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}

// ---------------- styles (modal tuned to your app theme) ----------------
const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.25rem",
  background:
    "radial-gradient(circle at 50% 35%, rgba(0,210,255,0.10), rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.82) 100%)",
  backdropFilter: "blur(6px)",
};

const modalStyle = {
  width: "min(820px, 96vw)",
  borderRadius: "16px",
  background:
    "linear-gradient(180deg, rgba(14,22,34,0.96), rgba(10,16,26,0.96))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 20px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,210,255,0.06) inset",
  overflow: "hidden",
};

const modalHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 1rem 0.85rem 1rem",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.0))",
};

const modalTitle = {
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#d4f1ff",
  letterSpacing: "0.3px",
};

const closeBtn = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.15)",
  color: "#d4f1ff",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  lineHeight: 1,
  transition: "background 0.2s ease, transform 0.2s ease",
};

const errorBox = {
  margin: "0.9rem 1rem 0 1rem",
  background: "rgba(240,105,105,0.12)",
  border: "1px solid rgba(240,105,105,0.35)",
  color: "#ffd2d2",
  padding: "0.7rem 0.85rem",
  borderRadius: "12px",
  fontSize: "0.95rem",
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.9rem",
};

const field = {
  display: "grid",
  gap: "0.35rem",
};

const labelStyle = {
  color: "#9fbad0",
  fontSize: "0.9rem",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "0.72rem 0.85rem",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.18)",
  color: "#eaf7ff",
  outline: "none",
  fontSize: "0.98rem",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.25) inset",
  width: "90%",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "120px",
  lineHeight: 1.4,
  width: "95%",
};

const actionsRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.6rem",
  paddingTop: "0.2rem",
  width: "95%",
};

const confirmBtn = {
  background: "linear-gradient(90deg, #3a7bd5, #00d2ff)",
  color: "#081018",
  border: "1px solid rgba(0,210,255,0.35)",
  borderRadius: "12px",
  padding: "0.62rem 1rem",
  cursor: "pointer",
  fontWeight: 800,
  letterSpacing: "0.2px",
  boxShadow: "0 10px 24px rgba(0,210,255,0.14)",
};

const cancelBtn = {
  background: "rgba(255,255,255,0.06)",
  color: "#d4f1ff",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "0.62rem 1rem",
  cursor: "pointer",
  fontWeight: 700,
};

const iconBtn = {
  background: "rgba(0,0,0,0.25)",
  color: "#d4f1ff",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "10px",
  padding: "0.25rem 0.5rem",
  cursor: "pointer",
  lineHeight: 1.1,
};
