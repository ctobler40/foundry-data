import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

// ---------- Helpers ----------
function toImperialDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return "";
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const fraction = Math.floor((dayOfYear / 365) * 1000)
    .toString()
    .padStart(3, "0");
  const millennium = 42;
  const accuracy = 3;
  return `${accuracy}.${fraction}.M${millennium}`;
}

function getEraLabel(imperialCode) {
  if (!imperialCode) return "Undated Record";
  const parts = imperialCode.split(".");
  const frac = parseInt(parts[1] || "0", 10);
  if (frac < 250) return "Early 42nd Millennium";
  if (frac < 500) return "Mid 42nd Millennium";
  if (frac < 750) return "Late 42nd Millennium";
  return "End of the 42nd Millennium";
}

// ---------- Main Component ----------
export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [selectedMillennium, setSelectedMillennium] = useState(42);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    imperial_code: "",
    related_character: "",
    related_campaign: "",
    source_file: "Custom",
  });

  // ------------------- FETCH -------------------
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

  // ------------------- FORM LOGIC -------------------
  const toggleForm = (eventToEdit = null) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setForm({
        title: eventToEdit.title,
        description: eventToEdit.description,
        event_date: eventToEdit.event_date?.slice(0, 10) || "",
        imperial_code: eventToEdit.imperial_code || "",
        related_character: eventToEdit.related_character || "",
        related_campaign: eventToEdit.related_campaign || "",
        source_file: eventToEdit.source_file || "Custom",
      });
    } else {
      setEditingEvent(null);
      setForm({
        title: "",
        description: "",
        event_date: "",
        imperial_code: "",
        related_character: "",
        related_campaign: "",
        source_file: "Custom",
      });
    }
    setShowForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imperial_code =
      form.imperial_code.trim() || toImperialDate(form.event_date);

    const payload = {
      ...form,
      imperial_code,
      related_character: form.related_character || null,
      related_campaign: form.related_campaign || null,
    };

    try {
      if (editingEvent) {
        await fetch(`${API_URL}api/timeline/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_URL}api/timeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setShowForm(false);
      setEditingEvent(null);

      const res = await fetch(`${API_URL}api/timeline`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setShowForm(false);
  };

  // ------------------- GROUPING -------------------
  const filteredEvents = events
    .filter(
      (ev) =>
        ev.millennium === selectedMillennium ||
        (ev.imperial_code && ev.imperial_code.includes(`M${selectedMillennium}`))
    )
    .sort((a, b) => {
      const getFrac = (code) => {
        if (!code) return 0;
        const parts = code.split(".");
        return parseInt(parts[1] || "0", 10);
      };
      return getFrac(a.imperial_code) - getFrac(b.imperial_code);
    });

  // Group events by Era Label
  const groupedEvents = filteredEvents.reduce((acc, ev) => {
    const imperial = ev.imperial_code || toImperialDate(ev.event_date);
    const era = getEraLabel(imperial);
    if (!acc[era]) acc[era] = [];
    acc[era].push(ev);
    return acc;
  }, {});

  // ------------------- RENDER -------------------
  return (
    <div className="page-container">
      <h1 className="page-title">Imperial Chronology — 42nd Millennium</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={() => toggleForm()} className="modern-btn">
          {showForm ? "Close Form" : "Add Event"}
        </button>
      </div>

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
            type="number"
            name="related_character"
            placeholder="Character ID (optional)"
            value={form.related_character}
            onChange={handleChange}
            className="modern-input"
          />
          <input
            type="number"
            name="related_campaign"
            placeholder="Campaign ID (optional)"
            value={form.related_campaign}
            onChange={handleChange}
            className="modern-input"
          />
          <div style={{ marginTop: "1rem" }}>
            <button type="submit" className="modern-btn">
              {editingEvent ? "Save Changes" : "Submit Event"}
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="modern-btn cancel-btn"
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            )}
          </div>
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

      {/* ---------- EVENT GROUPS ---------- */}
      <div className="month-view">
        <h2 className="month-title">
          Records of the {selectedMillennium}th Millennium
        </h2>

        {Object.keys(groupedEvents).length === 0 ? (
          <p className="no-events">No recorded events in M{selectedMillennium}</p>
        ) : (
          Object.entries(groupedEvents).map(([era, evList], eraIndex) => (
            <div key={era} className="era-section fade-in">
              <h3 className="era-heading">{era}</h3>
              {evList.map((ev, i) => {
                const imperial = ev.imperial_code || toImperialDate(ev.event_date);
                return (
                  <div
                    key={ev.id}
                    className={`event-card ${i % 2 === 0 ? "alt" : ""}`}
                  >
                    <div className="event-header">
                      <span className="imperial-badge">{imperial}</span>
                    </div>
                    <h4 className="event-title">{ev.title}</h4>
                    <p className="event-desc">
                      {ev.description || "No description available."}
                    </p>
                    <div className="event-meta">
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
                    <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                      <button
                        onClick={() => toggleForm(ev)}
                        className="modern-btn small-btn"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
