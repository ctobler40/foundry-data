import React from "react";

function CharacterCard({ char, onClick, onEdit }) {
  const getStatusColor = (status) => {
    if (!status) return "#aaa";
    const s = status.toLowerCase();
    if (s === "alive") return "#4cff4c";
    if (s === "dead") return "#ff4c4c";
    if (s === "missing") return "#ffd700";
    return "#aaa";
  };

  const getBackgroundTint = (status) => {
    if (!status) return "#1e1e1e";
    const s = status.toLowerCase();
    if (s === "alive") return "linear-gradient(180deg, rgba(40,80,40,0.25), #1e1e1e)";
    if (s === "dead") return "linear-gradient(180deg, rgba(80,40,40,0.25), #1e1e1e)";
    if (s === "missing") return "linear-gradient(180deg, rgba(100,90,30,0.25), #1e1e1e)";
    return "#1e1e1e";
  };

  return (
    <div
      key={char.id}
      className="feature-card"
      style={{
        background: getBackgroundTint(char.status_label),
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "380px",
        maxWidth: "240px",
        textAlign: "center",
        transition: "background 0.3s ease",
      }}
    >
      <img
        src={char.iconhtml || "/images/default.png"}
        alt={char.name}
        className="character-image"
        onClick={() => onClick(char)}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "0.75rem",
          cursor: "pointer",
          border: "2px solid #4da6ff",
        }}
      />

      <h3 style={{ color: "#4da6ff", marginBottom: "0.25rem" }}>{char.name}</h3>
      <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
        {char.description}
      </p>

      <p style={{ marginBottom: "0.25rem" }}>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color: getStatusColor(char.status_label),
            fontWeight: "bold",
          }}
        >
          {char.status_label || "Unknown"}
        </span>
      </p>

      {char.causeofdeath && (
        <p
          style={{
            fontSize: "0.9rem",
            color: "#ccc",
            marginBottom: "0.75rem",
          }}
        >
          <strong>Cause of Death:</strong> {char.causeofdeath}
        </p>
      )}

      <button
        className="modern-btn"
        onClick={() => onEdit(char)}
        style={{
          marginTop: "0.5rem",
          width: "100%",
          maxWidth: "180px",
        }}
      >
        Update
      </button>
    </div>
  );
}

export default CharacterCard;
