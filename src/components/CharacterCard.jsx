import React from "react";

function CharacterCard({ char, onClick, onEdit }) {
  return (
    <div key={char.id} className="character-card">
      <div className="character-content">
        {char.iconhtml ? (
          <img
            src={char.iconhtml}
            alt="Upload Photo"
            className="character-image"
            onClick={() => onClick(char)}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <img
            src="/images/default.png"
            alt="Upload Photo"
            className="character-image"
            onClick={() => onClick(char)}
            style={{ cursor: "pointer" }}
          />
        )}

        <h3>{char.name}</h3>
        <p>{char.description}</p>

        <p className="status-line">
          <strong>Status:</strong> {char.status_label || "Unknown"}
        </p>

        {char.causeofdeath && (
          <p className="cause-line">
            <strong>Cause of Death:</strong> {char.causeofdeath}
          </p>
        )}
      </div>

      <button
        className="modern-btn character-update-btn"
        onClick={() => onEdit(char)}
      >
        Update
      </button>
    </div>
  );
}

export default CharacterCard;
