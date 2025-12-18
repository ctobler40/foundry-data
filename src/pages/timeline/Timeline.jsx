import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

function toImperialDate(session) {
  if (!session || isNaN(session)) return "";
  const fraction = session.toString().padStart(3, "0");
  const millennium = 42;
  const accuracy = 3;
  return `${accuracy}.${fraction}.M${millennium}`;
}

export default function Timeline() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedMillennium, setSelectedMillennium] = useState(42);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_session: "",
    imperial_code: "",
    related_character: "",
    related_planet: "",
    additional_characters: [],
    related_campaign: "Chalnath Expanse",
    source_file: "Custom",
  });

  // ------------------- SEARCH -------------------
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}api/timeline/search?keyword=${encodeURIComponent(searchKeyword)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching events:", err);
    }
  };

  // ------------------- FETCH -------------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [evRes, chRes, plRes] = await Promise.all([
          fetch(`${API_URL}api/timeline`),
          fetch(`${API_URL}api/characters`),
          fetch(`${API_URL}api/campaign/planets`),
        ]);
        const [evData, chData, plData] = await Promise.all([
          evRes.json(),
          chRes.json(),
          plRes.json(),
        ]);
        setEvents(evData);
        setCharacters(chData);
        setPlanets(plData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAll();
  }, []);

  function splitIntoSentences(text) {
    if (!text) return [];
    return text
      .split(".")
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // ------------------- FORM LOGIC -------------------
  const toggleForm = (eventToEdit = null) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setForm({
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        event_session: eventToEdit.event_session || "",
        imperial_code: eventToEdit.imperial_code || "",
        related_character: eventToEdit.related_character || "",
        related_planet: eventToEdit.related_planet || "",
        additional_characters: eventToEdit.additional_characters || [],
        related_campaign: "Chalnath Expanse",
        source_file: eventToEdit.source_file || "Custom",
      });
    } else {
      setEditingEvent(null);
      setForm({
        title: "",
        description: "",
        event_session: "",
        imperial_code: "",
        related_character: "",
        related_planet: "",
        additional_characters: [],
        related_campaign: "Chalnath Expanse",
        source_file: "Custom",
      });
    }
    setShowForm(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_URL}api/timeline/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return alert("Failed to delete event.");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event_session = form.event_session
      ? parseInt(form.event_session)
      : null;
    const imperial_code =
      form.imperial_code.trim() || toImperialDate(event_session);
    const related_character = form.related_character
      ? parseInt(form.related_character)
      : null;
    const related_planet = form.related_planet
      ? parseInt(form.related_planet)
      : null;
    const related_campaign = 1;
    const additional_characters = form.additional_characters || [];

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      event_session,
      imperial_code,
      related_character,
      related_planet,
      additional_characters,
      related_campaign,
      source_file: form.source_file || "Custom",
    };

    try {
      const url = editingEvent
        ? `${API_URL}api/timeline/${editingEvent.id}`
        : `${API_URL}api/timeline`;
      const method = editingEvent ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return alert(`Failed: ${data.error || res.statusText}`);
      setShowForm(false);
      setEditingEvent(null);
      const refreshed = await fetch(`${API_URL}api/timeline`);
      setEvents(await refreshed.json());
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  // ------------------- FILTER -------------------
  const sessions = [...new Set(events.map((ev) => ev.event_session))].sort(
    (a, b) => a - b
  );
  const filteredEvents = events
    .filter(
      (ev) =>
        (!selectedSession || ev.event_session === selectedSession) &&
        (!selectedPlanet || ev.related_planet === selectedPlanet.id)
    )
    .sort((a, b) => (a.event_session || 0) - (b.event_session || 0));

  // ------------------- RENDER -------------------
  return (
    <div className="page-container">

      {/* ------------------- PLANET DISPLAY ------------------- */}
      {!selectedPlanet ? (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {planets.map((p) => (
              <div key={p.id} className="event-card alt">
                <h3 className="event-title">{p.name}</h3>
                <p className="event-desc">{p.details || "No details listed."}</p>
                <p className="event-meta">
                  {p.population && <span><strong>Pop:</strong> {p.population} </span>}
                  {p.environment && <span><strong>Env:</strong> {p.environment}</span>}
                </p>
                <div style={{ textAlign: "right" }}>
                  <button
                    className="modern-btn small-btn"
                    onClick={() => setSelectedPlanet(p)}
                  >
                    View Events
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button
              className="modern-btn"
              onClick={() => setSelectedPlanet(null)}
            >
              ← Back to All Planets
            </button>
          </div>

          <h2 className="month-title">
            Events on {selectedPlanet.name}
          </h2>

          <div
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            <button onClick={() => toggleForm()} className="modern-btn">
              {showForm ? "Close Form" : "Add Event"}
            </button>
          </div>

          {/* SESSION FILTER */}
          <div
            className="session-filter"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            <label>
              <strong>Filter by Session:</strong>{" "}
            </label>
            <select
              value={selectedSession || ""}
              onChange={(e) =>
                setSelectedSession(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="modern-input"
              style={{ width: "200px", marginLeft: "0.5rem" }}
            >
              <option value="">All Sessions</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  Session {session}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <form
              onSubmit={handleSearch}
              style={{ display: "inline-flex", gap: "0.5rem" }}
            >
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="modern-input"
                style={{ width: "250px" }}
              />
              <button type="submit" className="modern-btn">
                Search
              </button>
              {searchResults && (
                <button
                  type="button"
                  className="modern-btn cancel-btn"
                  onClick={() => {
                    setSearchKeyword("");
                    setSearchResults(null);
                  }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* FORM */}
          {showForm && (
            <form onSubmit={handleSubmit} className="timeline-form fade-in">
              <h2>{editingEvent ? "Update Event" : "Add New Event"}</h2>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={form.title}
                onChange={handleChange}
                className="modern-input"
                required
              />
              <input
                type="number"
                name="event_session"
                placeholder="Session #"
                value={form.event_session}
                onChange={handleChange}
                className="modern-input"
              />
              <select
                name="related_planet"
                value={form.related_planet}
                onChange={handleChange}
                className="modern-input"
              >
                <option value="">Select Planet</option>
                {planets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="modern-input"
                rows="3"
              />
              <label>
                <strong>Journal Entry (Main Character):</strong>
              </label>
              <select
                name="related_character"
                value={form.related_character}
                onChange={handleChange}
                className="modern-input"
              >
                <option value="">None</option>
                {characters
                  .filter((c) => c.characterimportance === 1)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" className="modern-btn">
                  {editingEvent ? "Save Changes" : "Submit Event"}
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="modern-btn cancel-btn"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* EVENTS */}
          <div className="month-view">
            {(searchResults ? searchResults : filteredEvents).length === 0 ? (
              <p className="no-events">No recorded events found.</p>
            ) : (
              (searchResults ? searchResults : filteredEvents).map((ev, i) => {
                const imperial =
                  ev.imperial_code || toImperialDate(ev.event_session);
                const author = ev.character_name || "Unknown";
                return (
                  <div
                    key={ev.id}
                    className={`event-card ${i % 2 === 0 ? "alt" : ""}`}
                  >
                    <div className="event-header">
                      <span className="imperial-badge">{imperial}</span>
                      <span className="session-tag">
                        Session {ev.event_session}
                      </span>
                    </div>
                    <h4 className="event-title">{ev.title}</h4>
                    <div className="event-desc">
                      {splitIntoSentences(ev.description).map((sentence, idx) => (
                        <div
                          key={idx}
                          className="event-desc-sentence"
                        >
                          {sentence}.
                        </div>
                      ))}
                    </div>
                    <p className="event-meta">
                      <strong>Entered By:</strong> {author}
                    </p>
                    <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                      <button
                        onClick={() => toggleForm(ev)}
                        className="modern-btn small-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="modern-btn small-btn cancel-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
