import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Wargear() {
  const [search, setSearch] = useState("");

  const [armor, setArmor] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [augmetics, setAugmetics] = useState([]);
  const [tools, setTools] = useState([]);
  const [weaponUpgrades, setWeaponUpgrades] = useState([]);
  const [reloadsAndAmmo, setReloadsAndAmmo] = useState([]);
  const [consumables, setConsumables] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchType, setSearchType] = useState("name");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchWargear() {
      try {
        setLoading(true);
        setError("");

        const [
          armorRes,
          weaponsRes,
          augmeticsRes,
          toolsRes,
          upgradesRes,
          ammoRes,
          consumablesRes,
        ] = await Promise.all([
          fetch(`${API_BASE}/api/equipment/category/armor`),
          fetch(`${API_BASE}/api/equipment/category/weapons`),
          fetch(`${API_BASE}/api/equipment/category/augmetics`),
          fetch(`${API_BASE}/api/equipment/category/tools`),
          fetch(`${API_BASE}/api/equipment/category/upgrades`),
          fetch(`${API_BASE}/api/equipment/category/ammunition`),
          fetch(`${API_BASE}/api/equipment/category/consumables`),
        ]);

        const responses = [
          armorRes,
          weaponsRes,
          augmeticsRes,
          toolsRes,
          upgradesRes,
          ammoRes,
          consumablesRes,
        ];

        const failed = responses.find((res) => !res.ok);
        if (failed) throw new Error(`Failed to fetch wargear: ${failed.status}`);

        const [
          armorData,
          weaponsData,
          augmeticsData,
          toolsData,
          upgradesData,
          ammoData,
          consumablesData,
        ] = await Promise.all(responses.map((res) => res.json()));

        setArmor(armorData);
        setWeapons(weaponsData);
        setAugmetics(augmeticsData);
        setTools(toolsData);
        setWeaponUpgrades(upgradesData);
        setReloadsAndAmmo(ammoData);
        setConsumables(consumablesData);
      } catch (err) {
        console.error(err);
        setError("Unable to load wargear.");
      } finally {
        setLoading(false);
      }
    }

    fetchWargear();
  }, []);

  const equipment = useMemo(() => {
    const upgradeWithoutAmmo = weaponUpgrades.filter(
      (item) => item.subcategory !== "Reload / Ammo"
    );

    return [
      ...weapons,
      ...armor,
      ...augmetics,
      ...tools,
      ...upgradeWithoutAmmo,
      ...reloadsAndAmmo,
      ...consumables,
    ];
  }, [
    weapons,
    armor,
    augmetics,
    tools,
    weaponUpgrades,
    reloadsAndAmmo,
    consumables,
  ]);

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

  const filteredEquipment = useMemo(() => {
    const filtered = equipment.filter((item) => {
      const rawValue = item[searchType];

      const searchValue = Array.isArray(rawValue)
        ? rawValue.join(" ").toLowerCase()
        : String(rawValue ?? "").toLowerCase();

      return searchValue.includes(search.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      let valA = a[sortKey] ?? "";
      let valB = b[sortKey] ?? "";

      if (Array.isArray(valA)) valA = valA.join(", ");
      if (Array.isArray(valB)) valB = valB.join(", ");

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [equipment, search, searchType, sortKey, sortOrder]);

  const groupedEquipment = useMemo(() => {
    return filteredEquipment.reduce((groups, item) => {
      const category = item.category || "Uncategorized";
      const subcategory = item.subcategory || "General";

      if (!groups[category]) groups[category] = {};
      if (!groups[category][subcategory]) groups[category][subcategory] = [];

      groups[category][subcategory].push(item);
      return groups;
    }, {});
  }, [filteredEquipment]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return "";
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  if (loading) {
    return (
      <div className="talents-loading">
        <p>Loading Wargear...</p>
      </div>
    );
  }

  if (error) {
    return <p className="no-results">{error}</p>;
  }

  return (
    <div className="talents-page">
      <div className="talents-header">
        <h1>Wargear Index</h1>
        <p>
          A complete record of weapons, armour, augmetics, consumables, tools,
          upgrades, and other equipment.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search wargear by name..."
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchType("name");
            }}
            className="modern-input"
          />

          <input
            type="text"
            placeholder="Search by category..."
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchType("category");
            }}
            className="modern-input"
          />

          <input
            type="text"
            placeholder="Search by subcategory..."
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchType("subcategory");
            }}
            className="modern-input"
          />

          <input
            type="text"
            placeholder="Search by traits..."
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchType("traits");
            }}
            className="modern-input"
          />

          <input
            type="text"
            placeholder="Search by keywords..."
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchType("keywords");
            }}
            className="modern-input"
          />
        </div>
      </div>

      {filteredEquipment.length === 0 ? (
        <p className="no-results">No wargear found matching your search.</p>
      ) : (
        Object.entries(groupedEquipment).map(([category, subcategories]) => (
          <section key={category} className="wargear-category-section">
            <h2 className="wargear-category-title">{category}</h2>

            {Object.entries(subcategories).map(([subcategory, items]) => (
              <div
                key={`${category}-${subcategory}`}
                className="wargear-subcategory-section"
              >
                <h3 className="wargear-subcategory-title">{subcategory}</h3>

                <div className="talent-table-container">
                  <table className="talent-table styled-table wargear-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort("name")}>
                          Name{sortIcon("name")}
                        </th>
                        <th onClick={() => handleSort("damage")}>
                          Damage{sortIcon("damage")}
                        </th>
                        <th onClick={() => handleSort("ed")}>
                          ED{sortIcon("ed")}
                        </th>
                        <th onClick={() => handleSort("ap")}>
                          AP{sortIcon("ap")}
                        </th>
                        <th>Range</th>
                        <th onClick={() => handleSort("salvo")}>
                          Salvo{sortIcon("salvo")}
                        </th>
                        <th onClick={() => handleSort("armour_rating")}>
                          Armour{sortIcon("armour_rating")}
                        </th>
                        <th>Traits</th>
                        <th onClick={() => handleSort("value")}>
                          Value{sortIcon("value")}
                        </th>
                        <th onClick={() => handleSort("rarity")}>
                          Rarity{sortIcon("rarity")}
                        </th>
                        <th>Keywords</th>
                        <th>Description</th>
                        <th>Effect</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id ?? item.name}
                          className="talent-row"
                          onClick={() => setSelectedItem(item)}
                        >
                          <td className="talent-name">{safeText(item.name)}</td>
                          <td>{safeText(item.damage)}</td>
                          <td>{safeText(item.ed)}</td>
                          <td>{safeText(item.ap)}</td>
                          <td>{getRangeText(item)}</td>
                          <td>{safeText(item.salvo)}</td>
                          <td>{safeText(item.armour_rating)}</td>
                          <td>{safeText(item.traits)}</td>
                          <td>{safeText(item.value)}</td>
                          <td>{safeText(item.rarity)}</td>
                          <td>{safeText(item.keywords)}</td>
                          <td className="talent-effect">
                            {item.description?.length > 80
                              ? `${item.description.substring(0, 80)}...`
                              : safeText(item.description)}
                          </td>
                          <td className="talent-effect">
                            {item.effect?.length > 80
                              ? `${item.effect.substring(0, 80)}...`
                              : safeText(item.effect)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        ))
      )}

      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>
              ×
            </button>

            <h2>{selectedItem.name}</h2>
            <p><strong>Category:</strong> {safeText(selectedItem.category)}</p>
            <p><strong>Subcategory:</strong> {safeText(selectedItem.subcategory)}</p>
            <p><strong>Damage:</strong> {safeText(selectedItem.damage)}</p>
            <p><strong>ED:</strong> {safeText(selectedItem.ed)}</p>
            <p><strong>AP:</strong> {safeText(selectedItem.ap)}</p>
            <p><strong>Range:</strong> {getRangeText(selectedItem)}</p>
            <p><strong>Salvo:</strong> {safeText(selectedItem.salvo)}</p>
            <p><strong>Armour Rating:</strong> {safeText(selectedItem.armour_rating)}</p>
            <p><strong>Traits:</strong> {safeText(selectedItem.traits)}</p>
            <p><strong>Value:</strong> {safeText(selectedItem.value)}</p>
            <p><strong>Rarity:</strong> {safeText(selectedItem.rarity)}</p>
            <p><strong>Keywords:</strong> {safeText(selectedItem.keywords)}</p>
            <p><strong>Description:</strong> {safeText(selectedItem.description)}</p>
            <p><strong>Effect:</strong> {safeText(selectedItem.effect)}</p>
          </div>
        </div>
      )}
    </div>
  );
}