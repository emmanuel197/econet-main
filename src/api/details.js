import { clientGet, clientPut, clientDelete, clientContext, imageUrl, getPackagesString } from "./client";
import { sendLog } from "./account";

// Details / playback / bookmarks — ported from legacy fetchMoviesApi.js (the
// details+watch screens have no new designs, so the brief's closing rule applies:
// keep the existing workflow). Legacy bugs fixed in port:
//  - fetchTrailer inferred movie-vs-episode from window.location.pathname; the
//    type is now an explicit argument.
//  - every function re-read user_info at module load via legacy's stale pattern;
//    these use clientContext() at call time.

// v1/{ouid}/users/{uid}/movies/{id} — user-scoped movie details.
export const fetchMovieDetails = async (movieId) => {
  const { operator_uid, user_id } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/users/${user_id}/movies/${movieId}`);
  return res.status === "ok" ? res.data : null;
};

// v1/{ouid}/series/{id} — series details incl. seasons[].episodes[].
export const fetchSeriesDetails = async (seriesId) => {
  const { operator_uid } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/series/${seriesId}`);
  return res.status === "ok" ? res.data : null;
};

// v1/{ouid}/episodes/{id} — single episode info (next-episode popup, play logs).
export const fetchEpisodeInfo = async (episodeId) => {
  const { operator_uid } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/episodes/${episodeId}`);
  return res.status === "ok" ? res.data : null;
};

// Trailers play for everyone (no subscription gate). type: "movie" | "episode".
export const fetchTrailerUrl = async (id, type = "movie") => {
  const { operator_uid, user_id } = clientContext();
  const kind = type === "movie" ? "movies" : "episodes";
  try {
    const res = await clientGet(`v1/${operator_uid}/users/${user_id}/vod/trailers/${kind}/${id}`);
    return res?.data?.url || null;
  } catch {
    return null;
  }
};

// Playout link — the subscription-gated stream URL. type: "movie" | "series" | "live"
// (series plays EPISODE ids; live plays channel uids — legacy watch.js contract).
export const fetchPlayoutUrl = async (id, type) => {
  const { operator_uid, user_id } = clientContext();
  const path =
    type === "movie"
      ? `v1/${operator_uid}/users/${user_id}/vod/movies/${id}`
      : type === "series"
        ? `v1/${operator_uid}/users/${user_id}/vod/episodes/${id}`
        : `v1/${operator_uid}/users/${user_id}/live/channels/${id}`;
  const res = await clientGet(path);
  // ⚠ shape per legacy: data.url carries the stream URL.
  return res?.data?.url || null;
};

// vod/{type}/{id}/related — "More Like This" rail.
export const fetchSimilar = async (type, id) => {
  const { operator_uid } = clientContext();
  // packages added over legacy — most content listings 400 without it. The
  // path segment drifts too (legacy only ever called it with "series"; the
  // movie spelling 400s as "movies" on live) — try the candidates in order.
  const packages = await getPackagesString().catch(() => "");
  const segments = type === "series" ? ["series"] : ["movies", "movie"];
  for (const seg of segments) {
    try {
      const res = await clientGet(`v1/${operator_uid}/vod/${seg}/${id}/related`, { packages });
      if (res.status === "ok") return res.data;
    } catch {
      /* try next spelling */
    }
  }
  return [];
};

// ── Bookmarks (Keep Watching source) ────────────────────────────────────────
// Legacy stored watched time in ms via PUT; movies carry the id twice in the path
// ({movieId}/{bookmarkName} — MangoTV/GloTV pattern). EVERY bookmark call must be
// profile-scoped with ?profile= — without it the write lands outside the profile
// that my_content?profile_id= reads, so saves never show up (bug found live
// 2026-07-21; MangoTV content.js appends it on PUT/GET/DELETE alike).
const bookmarkProfileId = () => window.localStorage.getItem("afri_profile_id") || 1;

export const getLengthWatched = async (id, type) => {
  const { operator_uid, user_id } = clientContext();
  const kind = type === "series" ? "episodes" : "movies";
  try {
    const res = await clientGet(`v1/${operator_uid}/users/${user_id}/bookmarks/${kind}/${id}`, {
      profile: bookmarkProfileId(),
    });
    const rows = res?.data || [];
    return rows.length ? rows[rows.length - 1].time : 0;
  } catch {
    return 0;
  }
};

export const updateWatchlist = async (id, type, lengthWatchedInMs = 0) => {
  if (!id) return null;
  const { operator_uid, user_id } = clientContext();
  const profile = bookmarkProfileId();
  const path =
    type === "series"
      ? `v1/${operator_uid}/users/${user_id}/bookmarks/episodes/${id}?profile=${profile}`
      : `v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}/${id}?profile=${profile}`;
  console.log("[api] updateWatchlist PUT:", path, "time(ms):", lengthWatchedInMs);
  try {
    // Verified live 2026-07-21: UpdateBookmarkRequest.name must be a STRING —
    // a numeric id 400s ("cannot unmarshal number into field ... name").
    const res = await clientPut(path, { time: lengthWatchedInMs, name: String(id) });
    console.log("[api] updateWatchlist response:", res?.status, res?.data ?? res);
    return res.status === "ok" ? res.data : null;
  } catch (e) {
    console.log("[api] updateWatchlist FAILED:", e.response?.status, e.response?.data || e.message);
    return null;
  }
};

export const removeWatchlist = async (id, type = "movie") => {
  if (!id) return;
  const { operator_uid, user_id } = clientContext();
  const kind = type === "series" ? "episodes" : "movies";
  try {
    await clientDelete(
      `v1/${operator_uid}/users/${user_id}/bookmarks/${kind}/${id}?profile=${bookmarkProfileId()}`
    );
  } catch {
    /* non-fatal */
  }
};

// CRM play log (legacy sendPlayLogs, simplified: details are passed in rather
// than re-fetched — the watch page already holds them).
export const sendPlayLog = async (details, type, durationSeconds = 0) => {
  if (!details) return;
  try {
    await sendLog({
      action: "play",
      content_uid: details.uid,
      content_type: type === "series" ? "Episode" : "Movie",
      content_name: details.title || details.name || "",
      duration: durationSeconds,
    });
  } catch {
    /* analytics only */
  }
};

// Shared mapper: API item → poster card props (same shape as fetchMoviesApi.toCard).
export const detailsToCard = (item) => ({
  id: item.id ?? item.uid,
  image: imageUrl(item.image_id ?? item.image_store_id ?? item.image_stores?.[0]?.id) || "",
  title: item.title || item.name || "",
  metadata: [item.year].filter(Boolean).join(" · "),
  type: item.type,
  raw: item,
});
