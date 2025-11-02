import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

// Helper: convert a normal date into an Imperial Date (approx.)
function toImperialDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return "";
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const fraction = Math.floor((dayOfYear / 365) * 1000)
    .toString()
    .padStart(3, "0");
  const millennium = 42; // Warhammer 40k — 42nd Millennium
  const accuracy = 3; // Administratum-confirmed
  return `${accuracy}.${fraction}.M${millennium}`;
}

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [selectedMillennium, setSelectedMillennium] = useState(42);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    imperial_code: "",
    related_character: "",
    related_campaign: "",
    source_file: "Custom",
  });

  // ----------------------------------------
  // Fetch All Events
  // ----------------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}api/timeline`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching timeline events:", err);
      }
    };
    fetchEvents();
  }, []);

  // ----------------------------------------
  // Filter by Selected Millennium
  // ----------------------------------------
  useEffect(() => {
    const millenniaEvents = events.filter(
      (ev) =>
        ev.millennium === selectedMillennium ||
        (ev.imperial_code && ev.imperial_code.includes(`M${selectedMillennium}`))
    );

    // Sort by Imperial fraction if possible
    millenniaEvents.sort((a, b) => {
      const getFrac = (code) => {
        if (!code) return 0;
        const parts = code.split(".");
        return parseInt(parts[1] || "0", 10);
      };
      return getFrac(a.imperial_code) - getFrac(b.imperial_code);
    });

    setFilteredEvents(millenniaEvents);
  }, [selectedMillennium, events]);

  // ----------------------------------------
  // Form Control
  // ----------------------------------------
  const toggleForm = () => {
    setShowForm(!showForm);
    setForm({
      title: "",
      description: "",
      event_date: "",
      imperial_code: "",
      related_character: "",
      related_campaign: "",
      source_file: "Custom",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto-generate imperial code if not manually provided
    const imperial_code =
      form.imperial_code.trim() || toImperialDate(form.event_date);

    const payload = {
      ...form,
      imperial_code,
      related_character: form.related_character || null,
      related_campaign: form.related_campaign || null,
    };

    try {
      await fetch(`${API_URL}api/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toggleForm();
      const res = await fetch(`${API_URL}api/timeline`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className="page-container">
      <h1 className="page-title">Imperial Chronology — 42nd Millennium</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={toggleForm} className="modern-btn">
          {showForm ? "Close Form" : "Add Event"}
        </button>
      </div>

      {/* ---------- Add Event Form ---------- */}
      {showForm && (
        <form onSubmit={handleSubmit} className="timeline-form">
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
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            className="modern-input"
          />
          <input
            type="text"
            name="imperial_code"
            placeholder="Imperial Date (e.g. 3.234.M42)"
            value={form.imperial_code}
            onChange={handleChange}
            className="modern-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="modern-input"
            rows="3"
          />
          <input
            type="text"
            name="related_character"
            placeholder="Character ID (optional)"
            value={form.related_character}
            onChange={handleChange}
            className="modern-input"
          />
          <input
            type="text"
            name="related_campaign"
            placeholder="Campaign ID (optional)"
            value={form.related_campaign}
            onChange={handleChange}
            className="modern-input"
          />
          <button
            type="submit"
            className="modern-btn"
            style={{ marginTop: "1rem" }}
          >
            Submit Event
          </button>
        </form>
      )}

      {/* ---------- TIMELINE VIEW ---------- */}
      <div className="timeline-years-container">
        <div className="timeline-years">
          <div
            className={`timeline-year active`}
            onClick={() => setSelectedMillennium(42)}
          >
            <span>M{selectedMillennium}</span>
            <span className="year-count">{filteredEvents.length}</span>
          </div>
        </div>
      </div>

      {/* ---------- EVENT LIST ---------- */}
      <div className="month-view">
        <h2 className="month-title">Millennium {selectedMillennium}</h2>
        <div className="month-grid">
          {filteredEvents.length === 0 ? (
            <p className="no-events">No recorded events in M{selectedMillennium}</p>
          ) : (
            filteredEvents.map((ev) => (
              <div key={ev.id} className="event-card">
                <h3>
                  {ev.imperial_code || toImperialDate(ev.event_date)} —{" "}
                  {ev.title}
                </h3>
                <p>{ev.description || "No description available."}</p>
                {ev.character_name && (
                  <p>
                    <strong>Character:</strong> {ev.character_name}
                  </p>
                )}
                {ev.campaign_title && (
                  <p>
                    <strong>Campaign:</strong> {ev.campaign_title}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
