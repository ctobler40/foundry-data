function Talent({ talent, onClose }) {
  if (!talent) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{talent.name}</h2>
        <p><strong>XP Cost:</strong> {talent.xp_cost}</p>
        <p><strong>Requirements:</strong> {talent.requirements || "—"}</p>
        <p><strong>Rank Requirement:</strong> {talent.rank_requirement || "—"}</p>
        <p><strong>Species Requirement:</strong> {talent.species_requirement || "—"}</p>
        <hr />
        <p style={{ textAlign: "left" }}>{talent.effect}</p>
      </div>
    </div>
  );
}

export default Talent;
