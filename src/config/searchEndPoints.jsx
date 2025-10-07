const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export const SEARCH_ENDPOINTS = [
  // ----- Core Data -----
  { name: "Talents", url: `${API_URL}api/talents`, path: "/talents" },
  { name: "Characters", url: `${API_URL}api/characters`, path: "/characters" },
  { name: "Regroup Actions", url: `${API_URL}api/regroupActions`, path: "/regroup-actions" },
  { name: "Ascension Packages", url: `${API_URL}api/ascensionPackages`, path: "/ascensions" },
  
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
];
