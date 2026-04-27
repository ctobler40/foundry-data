import { useEffect, useMemo, useState } from "react";
import Equipment from "../components/Equipment.jsx";
import Talent from "../components/Talent.jsx";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

const categoryOptions = [
  { value: "all", label: "Everything" },
  { value: "weapons", label: "Weapons" },
  { value: "armor", label: "Armour" },
  { value: "augmetics", label: "Augmetics" },
  { value: "tools", label: "Tools & Equipment" },
  { value: "upgrades", label: "Weapon Upgrades" },
  { value: "ammunition", label: "Reloads & Ammunition" },
  { value: "consumables", label: "Combat Drugs & Consumables" },
  { value: "talents", label: "Talents" },
];

const restrictedKeywords = new Set([
  "ADEPTUS ASTARTES",
  "PRIMARIS",
  "ADEPTA SORORITAS",
  "ADEPTUS MECHANICUS",
  "SKITARII",
  "CULT MECHANICUS",
  "ADEPTUS CUSTODES",
  "CUSTODIAN",
  "CUSTODES",
  "ANATHEMA PSYKANA",
  "ASTRA MILITARUM",
  "ADEPTUS ARBITES",
  "NAVIS IMPERIALIS",
  "GREY KNIGHTS",
  "BLACK TEMPLARS",
  "DARK ANGELS",
  "BLOOD ANGELS",
  "FLESH TEARERS",
  "SPACE WOLVES",
  "WHITE SCARS",
  "RAVEN GUARD",
  "DEATHWATCH",
  "ORK",
  "AELDARI",
  "ASURYANI",
  "DRUKHARI",
  "HARLEQUIN",
  "T’AU EMPIRE",
  "T'AU EMPIRE",
  "T’AU",
  "T'AU",
  "FIRE CASTE",
  "LEAGUES OF VOTANN",
  "CHAOS",
  "HERETIC ASTARTES",
  "NURGLE",
  "KHORNE",
  "TZEENTCH",
  "SLAANESH",
  "KROOT",
]);

const statAliases = {
  strength: "strength",
  toughness: "toughness",
  agility: "agility",
  initiative: "initiative",
  willpower: "willpower",
  intellect: "intellect",
  fellowship: "fellowship",
  athletics: "athletics",
  awareness: "awareness",
  "ballistic skill": "ballistic_skill",
  cunning: "cunning",
  deception: "deception",
  insight: "insight",
  intimidation: "intimidation",
  investigation: "investigation",
  leadership: "leadership",
  medicae: "medicae",
  persuasion: "persuasion",
  pilot: "pilot",
  "psychic mastery": "psychic_mastery",
  scholar: "scholar",
  stealth: "stealth",
  survival: "survival",
  tech: "tech",
  "weapon skill": "weapon_skill",
};

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
  const [talents, setTalents] = useState([]);

  const [characters, setCharacters] = useState([]);
  const [selectedCharacterName, setSelectedCharacterName] = useState("");
  const [selectedCharacterStats, setSelectedCharacterStats] = useState(null);

  const [tier, setTier] = useState(2);

  const [loading, setLoading] = useState(true);
  const [characterStatsLoading, setCharacterStatsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchType, setSearchType] = useState("name");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);

  const normalize = (value) => String(value ?? "").trim().toUpperCase();

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        setError("");

        const [
          charsRes,
          armorRes,
          weaponsRes,
          augmeticsRes,
          toolsRes,
          upgradesRes,
          ammoRes,
          consumablesRes,
          talentsRes,
        ] = await Promise.all([
          fetch(`${API_URL}api/characters`),
          fetch(`${API_URL}api/equipment/category/armor`),
          fetch(`${API_URL}api/equipment/category/weapons`),
          fetch(`${API_URL}api/equipment/category/augmetics`),
          fetch(`${API_URL}api/equipment/category/tools`),
          fetch(`${API_URL}api/equipment/category/upgrades`),
          fetch(`${API_URL}api/equipment/category/ammunition`),
          fetch(`${API_URL}api/equipment/category/consumables`),
          fetch(`${API_URL}api/talents`),
        ]);

        const responses = [
          charsRes,
          armorRes,
          weaponsRes,
          augmeticsRes,
          toolsRes,
          upgradesRes,
          ammoRes,
          consumablesRes,
          talentsRes,
        ];

        const failed = responses.find((res) => !res.ok);
        if (failed) throw new Error(`Failed to fetch data: ${failed.status}`);

        const [
          chars,
          armorData,
          weaponsData,
          augmeticsData,
          toolsData,
          upgradesData,
          ammoData,
          consumablesData,
          talentsData,
        ] = await Promise.all(responses.map((res) => res.json()));

        setCharacters(
          Array.isArray(chars)
            ? chars.filter((c) => c.characterimportance === 1)
            : []
        );

        setArmor(Array.isArray(armorData) ? armorData : []);
        setWeapons(Array.isArray(weaponsData) ? weaponsData : []);
        setAugmetics(Array.isArray(augmeticsData) ? augmeticsData : []);
        setTools(Array.isArray(toolsData) ? toolsData : []);
        setWeaponUpgrades(Array.isArray(upgradesData) ? upgradesData : []);
        setReloadsAndAmmo(Array.isArray(ammoData) ? ammoData : []);
        setConsumables(Array.isArray(consumablesData) ? consumablesData : []);
        setTalents(Array.isArray(talentsData) ? talentsData : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load character builds.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const fetchCharacterStats = async (characterName) => {
    try {
      setCharacterStatsLoading(true);
      setSelectedCharacterName(characterName);

      const res = await fetch(
        `${API_URL}api/characterstats/name/${encodeURIComponent(characterName)}`
      );

      if (!res.ok) throw new Error(`Failed to fetch character stats: ${res.status}`);

      const data = await res.json();
      setSelectedCharacterStats(data);
    } catch (err) {
      console.error(err);
      setSelectedCharacterStats(null);
    } finally {
      setCharacterStatsLoading(false);
    }
  };

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
    if (selectedCategory === "talents") return [];

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

  const getSearchValue = (item, key) => {
    const rawValue = item[key];

    if (Array.isArray(rawValue)) return rawValue.join(" ").toLowerCase();

    return String(rawValue ?? "").toLowerCase();
  };

  const getRequirementText = (item) => {
    return [
      item.name,
      item.category,
      item.subcategory,
      item.traits,
      item.requirements,
      item.description,
      item.effect,
      Array.isArray(item.keywords) ? item.keywords.join(" ") : "",
    ]
      .join(" ")
      .toLowerCase();
  };

  const getCharacterKeywords = () => {
    return new Set(
      Array.isArray(selectedCharacterStats?.keywords)
        ? selectedCharacterStats.keywords.map(normalize)
        : []
    );
  };

  const passesKeywordRequirements = (item) => {
    if (!selectedCharacterStats) return true;

    const characterKeywords = getCharacterKeywords();

    const itemKeywords = Array.isArray(item.keywords)
      ? item.keywords.map(normalize)
      : [];

    const requirementText = getRequirementText(item);

    const explicitRequiredKeywords = [...restrictedKeywords].filter((keyword) =>
      requirementText.includes(keyword.toLowerCase())
    );

    const itemRestrictedKeywords = itemKeywords.filter((keyword) =>
      restrictedKeywords.has(keyword)
    );

    const requiredKeywords = [
      ...new Set([...explicitRequiredKeywords, ...itemRestrictedKeywords]),
    ];

    if (requiredKeywords.length === 0) return true;
    if (requiredKeywords.includes("ANY")) return true;

    return requiredKeywords.some((keyword) => characterKeywords.has(keyword));
  };

  const passesStatRequirements = (item) => {
    if (!selectedCharacterStats) return true;

    const text = getRequirementText(item);

    return Object.entries(statAliases).every(([label, statKey]) => {
      const regex = new RegExp(`${label}\\s*(?:rating\\s*)?(\\d+)\\+`, "i");
      const match = text.match(regex);

      if (!match) return true;

      const requiredValue = Number(match[1]);
      const characterValue = Number(selectedCharacterStats[statKey] ?? 0);

      return characterValue >= requiredValue;
    });
  };

  const passesTierRequirements = (item) => {
    const text = getRequirementText(item);

    const tierMatch = text.match(/tier\s*(\d+)\+?/i);
    if (!tierMatch) return true;

    const requiredTier = Number(tierMatch[1]);
    return tier >= requiredTier;
  };

  const passesCharacterRequirements = (item) => {
    return (
      passesKeywordRequirements(item) &&
      passesStatRequirements(item) &&
      passesTierRequirements(item)
    );
  };

  const characterFilteredEquipment = useMemo(() => {
    return equipment.filter(passesCharacterRequirements);
  }, [equipment, selectedCharacterStats, tier]);

  const filteredEquipment = useMemo(() => {
    const filtered = characterFilteredEquipment.filter((item) => {
      return getSearchValue(item, searchType).includes(search.toLowerCase());
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
  }, [characterFilteredEquipment, search, searchType, sortKey, sortOrder]);

  const filteredTalents = useMemo(() => {
    const compatibleTalents = talents.filter(passesCharacterRequirements);

    const searchedTalents = compatibleTalents.filter((talent) => {
      return getSearchValue(talent, searchType).includes(search.toLowerCase());
    });

    return [...searchedTalents].sort((a, b) => {
      let valA = a[sortKey] ?? "";
      let valB = b[sortKey] ?? "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [talents, selectedCharacterStats, tier, search, searchType, sortKey, sortOrder]);

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

  const shouldShowEquipment = selectedCategory !== "talents";
  const shouldShowTalents = selectedCategory === "all" || selectedCategory === "talents";

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
        <p>Loading Character Builds...</p>
      </div>
    );
  }

  if (error) return <p className="no-results">{error}</p>;

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
                    selectedCharacterName === char.name ? "active" : ""
                  }`}
                  onClick={() => fetchCharacterStats(char.name)}
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

        {characterStatsLoading && <p>Loading character stats...</p>}

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
              <option value="requirements">Requirements</option>
              <option value="traits">Traits</option>
              <option value="keywords">Keywords</option>
              <option value="description">Description</option>
              <option value="effect">Effect</option>
            </select>
          </div>
        </div>
      </div>

      {selectedCharacterStats && (
        <p className="characterBuild-active-character">
          Showing compatible options for{" "}
          <strong>{selectedCharacterStats.character_name}</strong>
        </p>
      )}

      {shouldShowEquipment &&
        (filteredEquipment.length === 0 ? (
          <p className="no-results">No compatible wargear found.</p>
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
        ))}

      {shouldShowTalents && (
        <section className="wargear-category-section">
          <h2 className="wargear-category-title">Talents</h2>

          {filteredTalents.length === 0 ? (
            <p className="no-results">No compatible talents found.</p>
          ) : (
            <div className="talent-table-container">
              <table className="talent-table styled-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>
                      Name{sortIcon("name")}
                    </th>
                    <th onClick={() => handleSort("xp_cost")}>
                      XP{sortIcon("xp_cost")}
                    </th>
                    <th onClick={() => handleSort("requirements")}>
                      Requirements{sortIcon("requirements")}
                    </th>
                    <th>Effect</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTalents.map((talent) => (
                    <tr
                      key={talent.id ?? talent.name}
                      className="talent-row"
                      onClick={() => setSelectedTalent(talent)}
                    >
                      <td className="talent-name">{safeText(talent.name)}</td>
                      <td>{safeText(talent.xp_cost)}</td>
                      <td>{safeText(talent.requirements)}</td>
                      <td className="talent-effect">
                        {talent.effect?.length > 100
                          ? `${talent.effect.substring(0, 100)}...`
                          : safeText(talent.effect)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {selectedItem && (
        <Equipment
          equipment={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {selectedTalent && (
        <Talent
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
        />
      )}
    </div>
  );
}