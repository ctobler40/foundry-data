import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

const categoryOptions = [
  { value: "all", label: "All Wargear" },
  { value: "weapons", label: "Weapons" },
  { value: "armor", label: "Armour" },
  { value: "augmetics", label: "Augmetics" },
  { value: "tools", label: "Tools & Equipment" },
  { value: "upgrades", label: "Weapon Upgrades" },
  { value: "ammunition", label: "Reloads & Ammunition" },
  { value: "consumables", label: "Combat Drugs & Consumables" },
];

export default function CharacterBuilds() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [armor, setArmor] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [augmetics, setAugmetics] = useState([]);
  const [tools, setTools] = useState([]);
  const [weaponUpgrades, setWeaponUpgrades] = useState([]);
  const [reloadsAndAmmo, setReloadsAndAmmo] = useState([]);
  const [consumables, setConsumables] = useState([]);
  
  const [characters, setCharacters] = useState([]);
  const [hrellikData, setHrellikData] = useState([]);
  const [kalesonData, setKalesonData] = useState([]);
  const [joeData, setJoeData] = useState([]);
  const [agnesData, setAgnesData] = useState([]);
  const [victorData, setVictorData] = useState([]);
  const [dahliaData, setDahliaData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchType, setSearchType] = useState("name");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
    try {
        const [charsRes] = await Promise.all([
            fetch(`${API_URL}api/characters`)
        ]);

        const chars = await charsRes.json();
        setCharacters(Array.isArray(chars) ? chars.filter(c => c.characterimportance === 1) : []);
    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        setLoading(false);
    }
    };
    fetchAllData();
}, []);

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
          fetch(`${API_URL}api/equipment/category/armor`),
          fetch(`${API_URL}api/equipment/category/weapons`),
          fetch(`${API_URL}api/equipment/category/augmetics`),
          fetch(`${API_URL}api/equipment/category/tools`),
          fetch(`${API_URL}api/equipment/category/upgrades`),
          fetch(`${API_URL}api/equipment/category/ammunition`),
          fetch(`${API_URL}api/equipment/category/consumables`),
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

  const equipmentByCategory = useMemo(() => {
    const upgradeWithoutAmmo = weaponUpgrades.filter(
      (item) => item.subcategory !== "Reload / Ammo"
    );

    return {
      weapons,
      armor,
      augmetics,
      tools,
      upgrades: upgradeWithoutAmmo,
      ammunition: reloadsAndAmmo,
      consumables,
    };
  }, [
    weapons,
    armor,
    augmetics,
    tools,
    weaponUpgrades,
    reloadsAndAmmo,
    consumables,
  ]);

  const equipment = useMemo(() => {
    if (selectedCategory === "all") {
      return Object.values(equipmentByCategory).flat();
    }

    return equipmentByCategory[selectedCategory] || [];
  }, [equipmentByCategory, selectedCategory]);

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
        <h1>Character Builds</h1>
        <div className="characterBuild-filters">
            {characters.length > 0 ? (
                <div className="characterBuild-grid">
                {characters.map((char) => (
                    <div
                    key={char.id}
                    className={`characterBuild-card ${
                        search === char.name ? "active" : ""
                    }`}
                    onClick={() => setSearch(char.name)}
                    >
                    <div className="characterBuild-card-inner">
                        <h3>{char.name}</h3>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p>No characters found.</p>
            )}
            </div>

        <div className="wargear-filters">
          <div className="filter-field">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="modern-input"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field filter-field-wide">
            <label>Search</label>
            <input
              type="text"
              placeholder={`Search by ${searchType.replace("_", " ")}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="modern-input"
            />
          </div>

          <div className="filter-field">
            <label>Search Field</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="modern-input"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="traits">Traits</option>
              <option value="keywords">Keywords</option>
              <option value="description">Description</option>
              <option value="effect">Effect</option>
            </select>
          </div>
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
                        <th onClick={() => handleSort("name")}>Name{sortIcon("name")}</th>
                        <th onClick={() => handleSort("damage")}>Damage{sortIcon("damage")}</th>
                        <th onClick={() => handleSort("ed")}>ED{sortIcon("ed")}</th>
                        <th onClick={() => handleSort("ap")}>AP{sortIcon("ap")}</th>
                        <th>Range</th>
                        <th onClick={() => handleSort("salvo")}>Salvo{sortIcon("salvo")}</th>
                        <th onClick={() => handleSort("armour_rating")}>Armour{sortIcon("armour_rating")}</th>
                        <th>Traits</th>
                        <th onClick={() => handleSort("value")}>Value{sortIcon("value")}</th>
                        <th onClick={() => handleSort("rarity")}>Rarity{sortIcon("rarity")}</th>
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