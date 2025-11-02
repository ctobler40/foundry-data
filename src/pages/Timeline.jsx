import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    related_character: "",
    related_campaign: "",
    source_file: "Custom",
  });

  // Load all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}api/timeline`);
        const data = await res.json();
        console.log(data)
        setEvents(data);
      } catch (err) {
        console.error("Error fetching timeline events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Filter by selected year
  useEffect(() => {
    if (!selectedYear) return;
    const yearEvents = events.filter((ev) => {
      if (!ev.event_date) return false;
      const year = new Date(ev.event_date).getFullYear();
      return year === selectedYear;
    });
    setFilteredEvents(yearEvents);
  }, [selectedYear, events]);

  // Generate years 42000–42050
  const years = Array.from({ length: 16 }, (_, i) => 42015 + i);

  // When year clicked, toggle expansion
  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  // Open/close form
  const toggleForm = () => {
    setShowForm(!showForm);
    setForm({
      title: "",
      description: "",
      event_date: "",
      related_character: "",
      related_campaign: "",
      source_file: "Custom",
    });
  };

  // Handle form change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}api/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toggleForm();
      const res = await fetch(`${API_URL}api/timeline`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // Count events for each year
  const yearCounts = years.reduce((acc, year) => {
    const count = events.filter((ev) => {
      if (!ev.event_date) return false;
      console.log(ev.event_date);
      return new Date(ev.event_date).getFullYear() === year;
    }).length;
    return { ...acc, [year]: count };
  }, {});

  console.log(events)

  // Count events for each month in selected year
  const monthCounts =
    selectedYear &&
    Array.from({ length: 12 }, (_, i) => {
      const count = filteredEvents.filter((ev) => {
        const d = new Date(ev.event_date);
        return d.getMonth() === i;
      }).length;
      return count;
    });

  return (
    <div className="page-container">
      <h1 className="page-title">Imperial Chronology</h1>

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
            required
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
          <button type="submit" className="modern-btn" style={{ marginTop: "1rem" }}>
            Submit Event
          </button>
        </form>
      )}

      {/* ---------- YEAR SCROLL LINE ---------- */}
      <div className="timeline-years-container">
        <div className="timeline-years">
          {years.map((year) => (
            <div
              key={year}
              className={`timeline-year ${selectedYear === year ? "active" : ""}`}
              onClick={() => handleYearClick(year)}
            >
              <span>{year}</span>
              {yearCounts[year] > 0 && (
                <span className="year-count">{yearCounts[year]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- MONTH VIEW ---------- */}
      {selectedYear && (
        <div className="month-view">
          <h2 className="month-title">Year {selectedYear}</h2>
          <div className="month-grid">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const monthEvents = filteredEvents.filter((ev) => {
                const d = new Date(ev.event_date);
                return d.getMonth() + 1 === month;
              });

              const monthName = new Date(selectedYear, month - 1).toLocaleString(
                "default",
                { month: "long" }
              );

              const eventCount = monthCounts ? monthCounts[month - 1] : 0;

              return (
                <div
                  key={month}
                  className={`month-cell ${eventCount > 0 ? "has-events" : ""}`}
                >
                  <h3>
                    {monthName}
                    {eventCount > 0 && (
                      <span className="month-count">{eventCount}</span>
                    )}
                  </h3>
                  <div className="month-events">
                    {monthEvents.length === 0 ? (
                      <p className="no-events">No events</p>
                    ) : (
                      monthEvents.map((ev) => (
                        <div key={ev.id} className="event-dot" title={ev.title}>
                          <span className="event-popup">
                            <strong>{ev.title}</strong>
                            <br />
                            {ev.description || "No description"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
