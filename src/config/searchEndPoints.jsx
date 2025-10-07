const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export const SEARCH_ENDPOINTS = [
  // ----- Core Data -----
  { name: "Talents", url: `${API_URL}api/talents`, path: "/talents" },
  { name: "Characters", url: `${API_URL}api/characters`, path: "/characters" },
  { name: "Regroup Actions", url: `${API_URL}api/regroupActions`, path: "/regroup-actions" },
  { name: "Ascension Packages", url: `${API_URL}api/ascensionPackages`, path: "/ascensions`" },

  // ----- Campaign Overview -----
  {
    name: "Campaign Overview",
    url: `${API_URL}api/campaign`,
    path: "/campaign",
    note: "General overview of the Chalnath Expanse campaign.",
  },

  // ----- Campaign Subdata (no standalone pages) -----
  {
    name: "Factions",
    url: `${API_URL}api/campaign/factions`,
    path: "/campaign",
    note: "Displayed within campaign and location pages.",
  },
  {
    name: "Groups",
    url: `${API_URL}api/campaign/groups`,
    path: "/campaign",
    note: "Appears as part of the campaign overview.",
  },

  // ----- Chalnath Expanse Planets -----
  {
    name: "Planets",
    url: `${API_URL}api/campaign/planets`,
    path: "/campaign",
    note: "General list of planets within the Chalnath Expanse.",
  },
  {
    name: "Kalidonia",
    url: `${API_URL}api/campaign/planets`,
    path: "/campaign/kalidonia",
    note: "Planet-specific location page.",
  },

  // ----- Chalnath Locations Index -----
  {
    name: "Chalnath Locations",
    url: `${API_URL}api/campaign/planets`,
    path: "/chalnath-locations",
    note: "Hub for discovered planetary locations.",
  },

  // =====================================================================
  // ⚔️ Combat Reference System
  // =====================================================================
  {
    name: "Combat Overview",
    url: `${API_URL}api/combatActions`,
    path: "/combat",
    note: "Central hub for all Wrath & Glory combat mechanics.",
  },
  {
    name: "Combat Actions",
    url: `${API_URL}api/combatActions`,
    path: "/combat/actions",
    note: "Major actions that can be performed in combat rounds.",
  },
  {
    name: "Combat Options",
    url: `${API_URL}api/combatOptions`,
    path: "/combat/options",
    note: "Tactical options to modify attack and defense rolls.",
  },
  {
    name: "Attack Modifiers",
    url: `${API_URL}api/attackModifiers`,
    path: "/combat/modifiers",
    note: "Situational modifiers affecting attack rolls and DN values.",
  },
  {
    name: "Conditions",
    url: `${API_URL}api/conditions`,
    path: "/combat/conditions",
    note: "Status effects that alter character performance in battle.",
  },
  {
    name: "Combat References",
    url: `${API_URL}api/combatReferences`,
    path: "/combat/references",
    note: "Rule summaries and quick lookup references for GMs and players.",
  },
  {
    name: "Critical Hits",
    url: `${API_URL}api/criticalHits`,
    path: "/combat/critical-hits",
    note: "Detailed critical hit effects based on roll results.",
  },
  {
    name: "Combat Complications",
    url: `${API_URL}api/combatComplications`,
    path: "/combat/complications",
    note: "Combat mishaps and weapon failures that occur on bad rolls.",
  },
  {
    name: "Environmental Hazards",
    url: `${API_URL}api/environmentalHazards`,
    path: "/combat/environmental-hazards",
    note: "Hazardous battlefield conditions and terrain effects.",
  },
];
