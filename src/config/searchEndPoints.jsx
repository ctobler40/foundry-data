const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export const SEARCH_ENDPOINTS = [
  { name: "Talents", url: `${API_URL}api/talents`, path: "/talents" },
  { name: "Characters", url: `${API_URL}api/characters`, path: "/characters" },
  { name: "Regroup Actions", url: `${API_URL}api/regroupActions`, path: "/regroup-actions" },
  { name: "Campaign", url: `${API_URL}api/campaign`, path: "/campaign" },
  { name: "Factions", url: `${API_URL}api/campaign/factions`, path: "/campaign" },
  { name: "Planets", url: `${API_URL}api/campaign/planets`, path: "/campaign" },
  { name: "Groups", url: `${API_URL}api/campaign/groups`, path: "/campaign" },
];
