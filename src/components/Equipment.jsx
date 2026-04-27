function Equipment({ equipment, onClose }) {
  if (!equipment) return null;

  const safeText = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
  };

  const getRangeText = (item) => {
    return (
      item.range_text ||
      [item.range_short, item.range_medium, item.range_long]
        .filter((range) => range !== null && range !== undefined)
        .join(" / ") ||
      "—"
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{equipment.name}</h2>

        <p><strong>Category:</strong> {safeText(equipment.category)}</p>
        <p><strong>Subcategory:</strong> {safeText(equipment.subcategory)}</p>

        <hr />

        <p><strong>Damage:</strong> {safeText(equipment.damage)}</p>
        <p><strong>ED:</strong> {safeText(equipment.ed)}</p>
        <p><strong>AP:</strong> {safeText(equipment.ap)}</p>
        <p><strong>Range:</strong> {getRangeText(equipment)}</p>
        <p><strong>Salvo:</strong> {safeText(equipment.salvo)}</p>
        <p><strong>Armour Rating:</strong> {safeText(equipment.armour_rating)}</p>

        <hr />

        <p><strong>Traits:</strong> {safeText(equipment.traits)}</p>
        <p><strong>Value:</strong> {safeText(equipment.value)}</p>
        <p><strong>Rarity:</strong> {safeText(equipment.rarity)}</p>
        <p><strong>Keywords:</strong> {safeText(equipment.keywords)}</p>

        <hr />

        <p style={{ textAlign: "left" }}>
          <strong>Description:</strong><br />
          {safeText(equipment.description)}
        </p>

        <p style={{ textAlign: "left" }}>
          <strong>Effect:</strong><br />
          {safeText(equipment.effect)}
        </p>
      </div>
    </div>
  );
}

export default Equipment;