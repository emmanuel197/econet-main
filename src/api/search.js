import { clientContext, clientGet } from "./client";

/**
 * Search per the API brief — Search V3 GLOBAL (brief over legacy: legacy used
 * v1 movies-only search with translation=hr; the brief specifies
 * v3/{ouid}/search/global/{keyword}). Recent searches are cached locally per
 * the brief ("Users' searches should be cached and displayed as Recent Searches").
 */

const RECENT_KEY = "afri_recent_searches";
const RECENT_LIMIT = 10;

export const getRecentSearches = () => {
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (keyword) => {
  const cleaned = keyword.trim();
  if (!cleaned) return;
  const next = [cleaned, ...getRecentSearches().filter((k) => k !== cleaned)].slice(0, RECENT_LIMIT);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

export const clearRecentSearches = () => window.localStorage.removeItem(RECENT_KEY);

export const fetchSearchResults = async (query) => {
  const keyword = (query || "").replace(/[^\w\s]/gi, "").trim();
  if (!keyword) return { results: [], error: null };

  const { USE_FIXTURES } = await import("../utils/devFlags");
  if (USE_FIXTURES) return { results: [], error: "fixtures mode" };

  try {
    const { operator_uid } = clientContext();
    const res = await clientGet(`v3/${operator_uid}/search/global/${encodeURIComponent(keyword)}`);
    if (res.status === "ok") {
      addRecentSearch(keyword);
      return { results: res.data, error: null };
    }
    return { results: [], error: res.message || "search failed" };
  } catch (e) {
    return { results: [], error: e.message };
  }
};
