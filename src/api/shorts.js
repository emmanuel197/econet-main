import store from "../store/store";
import { fetchShortsBegin, fetchShortsSuccess, fetchShortsError } from "../store/slice/shortsSlice";
import { clientContext, clientGet, clientPost, getPackagesString, imageUrl } from "./client";
import { USE_FIXTURES } from "../utils/devFlags";
import formatRuntime from "../utils/formatRuntime";

/**
 * Afrishorts/Reels per the API brief (all new — no legacy counterpart):
 *  - Categories ("For You", "Trending", …): Rails Categories V3 v3/{ouid}/categories/rail
 *  - Category content: v1/{ouid}/categories/rail/content
 *  - Vertical trailer URLs: POST v1/{ouid}/users/{user_uid}/vertical_trailer with the
 *    grouped movie/series/episode ids
 * View/like counts are ignored per the brief. ⚠ shapes unverified (spec behind VPN).
 */

// Both rail endpoints 400 without `?packages=` (code 1034, verified live
// 2026-07-21 — same requirement as the movies/series/channels listings).
export const fetchRailCategories = async () => {
  const { operator_uid } = clientContext();
  const packages = await getPackagesString();
  const res = await clientGet(`v3/${operator_uid}/categories/rail`, { packages });
  return res.status === "ok" ? res.data : [];
};

export const fetchRailContent = async (categoryId) => {
  const { operator_uid } = clientContext();
  const packages = await getPackagesString();
  const res = await clientGet(`v1/${operator_uid}/categories/rail/content`, {
    packages,
    categories: categoryId,
  });
  return res.status === "ok" ? res.data : [];
};

// Grouped ids → vertical trailer video URLs for the Shorts player. The brief's
// path is users/{user_uid}/vertical_trailer — subscriber uid (afri_username)
// first, numeric user_id as fallback; body key shapes are ⚠ unverified.
export const fetchVerticalTrailers = async ({ movieIds = [], seriesIds = [], episodeIds = [] }) => {
  const { operator_uid, user_id } = clientContext();
  const subscriberUid = window.localStorage.getItem("afri_username");
  const body = {
    movies: movieIds,
    series: seriesIds,
    episodes: episodeIds,
  };

  for (const uid of [subscriberUid, user_id].filter(Boolean)) {
    try {
      const res = await clientPost(`v1/${operator_uid}/users/${uid}/vertical_trailer`, body);
      if (import.meta.env.DEV)
        console.log(`[api] vertical_trailer (${uid}) status:`, res.status, "data:", res.data);
      // Verified live: body = {status, data:{data:[{content_id, type, url, …}]}}
      if (res.status === "ok") return res.data?.data ?? res.data ?? [];
    } catch (e) {
      console.warn(
        `[api] vertical_trailer (${uid}) failed:`,
        e.response?.status,
        e.response?.data || e.message
      );
    }
  }
  return [];
};

/**
 * Open the Shorts player from an Afrishorts rail click (brief: "directed to the
 * Shorts page… play the vertical trailer of the selected movie or series…
 * continue viewing other related vertical trailers").
 *
 * Seeds the player's reel queue from the rail items immediately (poster frame as
 * the video still, poster as the profile avatar per the brief), navigates, then
 * resolves the real video URLs via the grouped vertical_trailer POST and
 * re-dispatches the queue with videoUrl filled in.
 */
export const openAfrishortsPlayer = async (items, selectedId, navigate) => {
  const dispatch = store.dispatch;

  const reels = items.map((item) => ({
    id: String(item.id),
    contentType: item.contentType || "movie",
    contentId: item.raw?.id ?? (USE_FIXTURES ? null : item.id),
    badge: "Wona Shorts",
    handle: `@${(item.title || "WONA").replace(/\s+/g, "")}`,
    title: item.title || "",
    hashtags: ["#WonaShorts"],
    audio: "Original audio · WONA",
    video: item.image,          // poster still until the trailer URL resolves
    videoUrl: null,
    creatorAvatar: item.image,  // brief: profile icon uses the poster image
    likes: "",
    duration: "",
    progress: 0,
    currentTime: "0:00",
    totalTime: "0:00",
    raw: item.raw,
  }));

  dispatch(fetchShortsSuccess({ reels }));
  navigate(`/shorts/${selectedId}`);

  // Resolve trailer URLs in the background (shapes ⚠ unverified — VPN spec).
  try {
    const movieIds = reels.filter((r) => r.contentType === "movie").map((r) => r.contentId);
    const seriesIds = reels.filter((r) => r.contentType === "series").map((r) => r.contentId);
    const trailers = await fetchVerticalTrailers({ movieIds, seriesIds });
    if (import.meta.env.DEV) console.log("[api] vertical_trailer response sample:", trailers?.[0]);

    const urlFor = (reel) => {
      const match = (Array.isArray(trailers) ? trailers : []).find(
        (t) =>
          (t.movie_id ?? t.series_id ?? t.content_id ?? t.id) === reel.contentId
      );
      return match?.url || match?.trailer_url || match?.video_url || null;
    };
    // Rail items may already carry the URL on the movie record itself.
    const inlineUrl = (reel) =>
      reel.raw?.vertical_trailer_url_ott || reel.raw?.vertical_trailer || null;

    dispatch(
      fetchShortsSuccess({
        reels: reels.map((r) => ({ ...r, videoUrl: urlFor(r) || inlineUrl(r) })),
      })
    );
  } catch (e) {
    console.error("[api] vertical_trailer fetch failed:", e.response?.data || e.message);
  }
};

/**
 * id → runtime map for the tiles' duration pill.
 *
 * Rail-content rows carry no duration, so it comes from the movie/series listings, which
 * DO expose `duration` in minutes. `✅ VERIFIED` 2026-07-30 against a screenshot of the
 * production mobile app: its pills are exactly this field as H:MM (159 → "2:39",
 * 90 → "1:30", 124 → "2:04", 63 → "1:03"), i.e. the full feature runtime — NOT the
 * vertical trailer's length, which no endpoint exposes (wiki open-questions #25).
 *
 * Cached per page-load: the listing is a big response and the rails re-fetch on every
 * chip change.
 */
let runtimeCache = null;
export const clearRuntimeCache = () => (runtimeCache = null);

const fetchRuntimes = async () => {
  if (runtimeCache) return runtimeCache;
  const { operator_uid, user_id } = clientContext();
  const packages = await getPackagesString();
  const map = new Map();
  try {
    const [moviesRes, seriesRes] = await Promise.all([
      clientGet(`v1/${operator_uid}/users/${user_id}/movies`, { packages }).catch(() => null),
      clientGet(`v1/${operator_uid}/series`, { packages }).catch(() => null),
    ]);
    const add = (rows) =>
      (Array.isArray(rows) ? rows : []).forEach((m) => {
        if (m?.id != null && m.duration) map.set(String(m.id), m.duration);
      });
    add(moviesRes?.status === "ok" ? moviesRes.data : []);
    add(seriesRes?.status === "ok" ? seriesRes.data : []);
    if (import.meta.env.DEV) console.log("[api] shorts runtimes cached:", map.size);
  } catch (e) {
    console.warn("[api] shorts runtimes lookup failed:", e.message);
  }
  runtimeCache = map;
  return map;
};

// Rail content rows → the card shape ShortsPage renders. Verified live
// 2026-07-21: rows nest as {id, heading_image_id, content:[items]}, items carry
// {id, uid, type, title, image_id, preview_image_id, year, critics_rating, …}.
// Per the brief, view/like counts are IGNORED for API content (views stays ""
// so the tile's conditional label never renders); fixtures keep their views.
const toShortCard = (item, runtimes) => ({
  id: item.id ?? item.uid,
  contentType: item.type === "series" ? "series" : "movie",
  image: imageUrl(item.image_id ?? item.preview_image_id) || "",
  title: item.title || item.name || "",
  // Runtime (H:MM) joined in from the movie/series listing — the rail rows have no
  // duration. Empty when the id isn't in the listing, and the badge then hides.
  duration: formatRuntime(runtimes?.get(String(item.id ?? item.uid))),
  views: "", // brief: don't display counts
  raw: item,
});

export const fetchShortsContent = async (categoryId = null) => {
  const dispatch = store.dispatch;
  if (USE_FIXTURES) {
    console.log("[api] fetchShortsContent: USE_FIXTURES is on — skipping API, fixtures render");
    // Clear the initial loader so fixtures (incl. their views labels, which the
    // brief's no-counts rule doesn't touch in design-review mode) are final.
    dispatch(fetchShortsSuccess({}));
    return false;
  }
  const { ready } = clientContext();
  if (!ready) {
    console.log("[api] fetchShortsContent: clientContext not ready — fixtures render");
    dispatch(fetchShortsSuccess({}));
    return false;
  }

  dispatch(fetchShortsBegin());
  try {
    const categories = await fetchRailCategories();
    const activeCategory = categoryId ?? categories[0]?.id;

    // "Trending Now" reads from the rail category that IS trending, so the section
    // stays put when the chips change (and doesn't just mirror the grid below it).
    // ⚠ ASSUMPTION: the brief documents only the rounded rail and the grid for this
    // screen. This operator returns IDENTICAL content for For You and Trending
    // (verified 2026-07-30), so live data can't distinguish "the Trending rail" from
    // "the selected rail" — the production app's row matches either. Falls back to the
    // selected rail's items when no trending-ish category exists.
    const trendingCat = categories.find((c) =>
      /trend/i.test(c.name || "") || /trend/i.test(c.uid || "")
    );
    const needsSeparateTrending =
      trendingCat && String(trendingCat.id) !== String(activeCategory);

    const [content, trendingContent, runtimes] = await Promise.all([
      activeCategory ? fetchRailContent(activeCategory) : [],
      needsSeparateTrending ? fetchRailContent(trendingCat.id).catch(() => null) : null,
      fetchRuntimes(),
    ]);

    // Rows nest per category ({id, heading_image_id, content:[…]}, verified live) —
    // flatten; keep the flat-list branch in case other rails differ.
    const flattenRows = (res) => {
      const rows = Array.isArray(res) ? res : [];
      const items = rows.some((r) => Array.isArray(r.content) || Array.isArray(r.movies))
        ? rows.flatMap((r) => r.content || r.movies || [])
        : rows;
      return { rows, items };
    };
    const { rows, items } = flattenRows(content);
    const cards = items.map((i) => toShortCard(i, runtimes)).filter((c) => c.id != null);

    // Banner (the feed's big 16:9 card) — the SELECTED rail category's
    // heading_image_id. `✅ VERIFIED` live 2026-07-30: the brief never mentions this
    // element; probing showed each rail category carries a heading image authored as
    // cover art (For You's uid is literally "contentCover", 1248×699). The content
    // rows echo the same id, so prefer the row and fall back to the category record.
    // Tapping it enters the player at the top of this category's queue.
    const activeCat = categories.find((c) => String(c.id) === String(activeCategory));
    const headingImageId =
      rows.find((r) => r.heading_image_id != null)?.heading_image_id ??
      activeCat?.heading_image_id ??
      null;
    const banner = headingImageId
      ? {
          id: cards[0]?.id ?? `rail-${activeCategory}`,
          image: imageUrl(headingImageId),
          title: activeCat?.name || "",
          // No API source for the design's LIVE badge / @handle / view count, and the
          // brief says counts are ignored — left blank so the card renders clean (as
          // the production app does). See wiki open-questions #23.
          views: "",
          contentType: cards[0]?.contentType || "movie",
          raw: cards[0]?.raw,
        }
      : null;

    // Trending Now — rail items ranked by their API order. `✅ VERIFIED` 2026-07-30:
    // the production app's row is these items in this order (Monica's error → My
    // Wife's Lover → Boomerang → Blade Trinity). Ranks come from position because the
    // API's `position` is 0 on every row; `top_list` on the category marks a ranked
    // rail if that ever needs honouring.
    const trendingCards = needsSeparateTrending && trendingContent
      ? flattenRows(trendingContent).items.map((i) => toShortCard(i, runtimes)).filter((c) => c.id != null)
      : cards;
    const trendingNow = trendingCards.slice(0, 10).map((c, i) => ({ ...c, rank: i + 1 }));

    if (import.meta.env.DEV)
      console.log(
        "[api] shorts — categories:", categories.length,
        "active:", activeCategory,
        "cards:", cards.length,
        "with image:", cards.filter((c) => c.image).length,
        "heading_image_id:", headingImageId
      );

    dispatch(
      fetchShortsSuccess({
        categories,
        // Brief: top rounded rail = first 10–15 items; grid = 20+ items.
        shortsForYou: cards.slice(0, 15),
        forYouGrid: cards.slice(0, 24),
        liveReelPreview: banner,
        trendingNow,
        // reels deliberately NOT set here — openAfrishortsPlayer seeds the
        // player queue in reel shape on click (raw rows would break /shorts/:id).
      })
    );
    return true;
  } catch (error) {
    console.error("[api] fetchShortsContent failed:", error.response?.data || error.message);
    dispatch(fetchShortsError(error.message));
    return false;
  }
};
