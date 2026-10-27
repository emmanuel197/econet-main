import axios from "axios";
import store from "../store/store";
import { fetchHomeBegin, fetchHomeSuccess, fetchHomeError } from "../store/slice/homeSlice";
import {
  fetchMoviesPageBegin,
  fetchMoviesPageSuccess,
  fetchMoviesPageError,
} from "../store/slice/moviesSlice";
import { CM_BASE } from "./authApis";
import { clientContext, clientGet, getPackagesString, imageUrl } from "./client";
import { fetchChannels, fetchChannelInfo, fetchLiveChannelCards } from "./liveTv";
import { getSelectedOperator } from "../utils/authConstants";
import { USE_FIXTURES } from "../utils/devFlags";
import formatRuntime from "../utils/formatRuntime";

/**
 * Home content per the API brief (wiki/raw/api-docs.md) — the brief takes precedence
 * over legacy fetchMoviesApi.js where they differ:
 *  - VOD rails: category ids come from CRM Client Settings `dashboard_categories`
 *    (legacy fetched ALL categories and bucketed client-side)
 *  - Banners: user-scoped v1/{ouid}/users/{user_id}/banners (legacy used the
 *    non-user /banners with a hardcoded accessKey)
 *  - Keep Watching: users/{user_id}/my_content (same as legacy watchlist)
 *  - Channel categories for homepage injection: v1/{ouid}/categories/channels;
 *    first injected category id = CRM settings `dashboard_category_id`, second =
 *    the channel category with uid "featured"
 *  - Afrishorts: movies with vertical_trailer/vertical_trailer_url_ott + series
 *    with has_vertical_trailer
 *
 * NOTE ⚠ response shapes are unverified against the live API (spec is behind VPN);
 * mapping is defensive and HomePage falls back to fixtures for any empty rail.
 */

// Keep Watching — MangoTV's Continue Watching pattern: my_content REQUIRES a
// profile_id param (our 400 without it); fallback is the profile bookmarks
// Hero background trailer (legacy DynamicBanner pattern): vod/trailers returns
// {data: {url}}. Legacy always hit the movies path from the homepage even for
// series banners — fixed here: series/episode content uses the episodes path.
export const fetchTrailer = async (contentId, kind = "movie") => {
  const { operator_uid, user_id, ready } = clientContext();
  if (!ready || !contentId) return null;
  const segment = /series|episode/.test(String(kind).toLowerCase()) ? "episodes" : "movies";
  try {
    const res = await clientGet(
      `v1/${operator_uid}/users/${user_id}/vod/trailers/${segment}/${contentId}`
    );
    return res?.data?.url || null;
  } catch {
    return null;
  }
};

// endpoint. Bookmarks carry no artwork, so details are batch-fetched per movie.
// startedOnly: Keep Watching keeps MangoTV's >=1%-progress filter; the My Stuff
// page shows EVERY bookmark (legacy Watchlist tab behaviour — no filter).
const fetchKeepWatching = async (operator_uid, user_id, { startedOnly = true } = {}) => {
  const profileId = window.localStorage.getItem("afri_profile_id") || 1;
  let movieBookmarks = [];
  let episodeBookmarks = [];

  try {
    const res = await clientGet(`v1/${operator_uid}/users/${user_id}/my_content`, {
      profile_id: profileId,
    });
    if (res.status === "ok") {
      movieBookmarks = res.data?.movie_bookmarks || [];
      episodeBookmarks = res.data?.episode_bookmarks || [];
    } else {
      console.log("[api] keep watching: my_content non-ok response:", res);
    }
  } catch (e) {
    console.log("[api] keep watching: my_content failed:", e.response?.status, e.response?.data || e.message);
    // fallback: profile bookmarks endpoint (movies only), per MangoTV
    try {
      const res = await clientGet(
        `v1/${operator_uid}/users/${user_id}/profiles/${profileId}/bookmarks/movies`
      );
      if (res.status === "ok") movieBookmarks = res.data || [];
    } catch (e2) {
      console.log("[api] keep watching: bookmarks fallback also failed:", e2.response?.status, e2.response?.data || e2.message);
      return [];
    }
  }

  if (import.meta.env.DEV) {
    console.log(
      "[api] keep watching — profile_id:", profileId,
      "movie bookmarks:", movieBookmarks.length,
      "episode bookmarks:", episodeBookmarks.length,
      "sample:", movieBookmarks[0]
    );
    // Watchlist debug: does the freshly-added bookmark come back at all?
    console.log(
      "[api] my_content movie bookmark rows (id/movie_id/time):",
      movieBookmarks.map((b) => ({ id: b.id, movie_id: b.movie_id, time: b.time, name: b.name }))
    );
  }

  // Progress copy for the card: "65% watched · 35 min left" (fixture format).
  // Durations arrive in either seconds or minutes depending on endpoint — treat
  // values above 300 as seconds.
  const progressSubtitle = (pct, duration) => {
    // Floor the display at 1% for any real progress — "0% watched" on a title
    // the user genuinely started reads as broken.
    const shown = pct > 0 ? Math.max(1, Math.round(pct)) : 0;
    const parts = [`${shown}% watched`];
    const mins = duration > 300 ? duration / 60 : duration;
    if (mins > 0) parts.push(`${Math.max(1, Math.round(mins * (1 - pct / 100)))} min left`);
    return parts.join(" · ");
  };
  const percentOf = (bookmark, duration) => {
    if (bookmark.percent_watched != null) return bookmark.percent_watched;
    // fallback: derive from position/duration (bookmark.time is ms in MangoTV)
    const secs = duration > 300 ? duration : duration * 60;
    return bookmark.time && secs ? Math.min(100, (bookmark.time / 1000 / secs) * 100) : 0;
  };

  // Bookmarks lack artwork — enrich with details (MangoTV batch pattern):
  // per-movie user detail fetches + one batched episodes fetch, in parallel.
  const [movieCards, episodeCards] = await Promise.all([
    Promise.all(
      movieBookmarks.slice(0, 15).map(async (bookmark) => {
        try {
          const res = await clientGet(
            `v1/${operator_uid}/users/${user_id}/movies/${bookmark.movie_id ?? bookmark.id}`
          );
          const movie = res.status === "ok" ? res.data : null;
          if (!movie) {
            console.log("[api] watchlist enrich: movie details EMPTY for bookmark", bookmark.movie_id ?? bookmark.id, res?.status);
            return null;
          }
          const duration = movie.duration ?? movie.metadata?.duration ?? 0;
          const pct = percentOf(bookmark, duration);
          return {
            id: `movie-${bookmark.movie_id ?? bookmark.id}`,
            contentId: bookmark.movie_id ?? bookmark.id,
            // Playout keys on the movie UID (Mango: "fetchVideoUrl expects UID"
            // — numeric ids 400 the vod/movies endpoint); details/bookmarks use
            // the numeric contentId.
            uid: movie.uid ?? null,
            contentType: "movie",
            // users/{uid}/movies/{id} records carry image_store_id (verified
            // live 2026-07-21 — not image_id like the listing rows).
            image:
              imageUrl(
                movie.image_store_id ??
                  movie.image_id ??
                  movie.image_stores?.[0]?.id ??
                  movie.preview_image_id
              ) || "",
            title: movie.title || "",
            subtitle: progressSubtitle(pct, duration),
            percentWatched: pct,
            bookmarkTime: bookmark.time ?? null,
            raw: { bookmark, movie },
          };
        } catch (e) {
          console.log(
            "[api] watchlist enrich: movie details FAILED for bookmark",
            bookmark.movie_id ?? bookmark.id, e.response?.status, e.response?.data || e.message
          );
          return null;
        }
      })
    ),
    // Episodes: one batched details call; cards navigate to the parent series.
    (async () => {
      const ids = episodeBookmarks.slice(0, 15).map((b) => b.episode_id ?? b.id).filter(Boolean);
      if (!ids.length) return [];
      try {
        const res = await clientGet(`v1/${operator_uid}/episodes`, {
          episodes_id: ids.join(","),
        });
        const byId = {};
        (res.status === "ok" ? res.data : []).forEach((ep) => (byId[ep.id] = ep));
        return episodeBookmarks.slice(0, 15).map((bookmark) => {
          const ep = byId[bookmark.episode_id ?? bookmark.id];
          if (!ep) return null;
          const duration = ep.duration ?? 0;
          const pct = percentOf(bookmark, duration);
          return {
            id: `episode-${bookmark.episode_id ?? bookmark.id}`,
            contentId: ep.series_id ?? bookmark.episode_id ?? bookmark.id,
            contentType: "series",
            image: imageUrl(ep.images?.PREVIEW ?? ep.images?.POSTER ?? ep.image_id) || "",
            title: ep.series_title || ep.title || "",
            subtitle: progressSubtitle(pct, duration),
            percentWatched: pct,
            bookmarkTime: bookmark.time ?? null,
            raw: { bookmark, episode: ep },
          };
        });
      } catch {
        return [];
      }
    })(),
  ]);

  // MangoTV gated Keep Watching on >=1% progress, but that hides a long movie
  // watched for a minute (1 min of 155 ≈ 0.6% — user-reported). "Started" here
  // means ANY saved playback time; the percent threshold stays as the fallback
  // for rows that carry percent_watched but no time.
  // Cards keep rendering even when artwork failed to resolve (the card shows
  // its placeholder panel) — dropping them made the rail flip between titles
  // whenever one enrich call failed intermittently. Newest bookmark first.
  const all = [...movieCards, ...episodeCards].filter(Boolean);
  const recency = (c) =>
    new Date(c.raw?.bookmark?.updated_at ?? c.raw?.bookmark?.created_at ?? 0).getTime();
  all.sort((x, y) => recency(y) - recency(x));
  const started = startedOnly
    ? all.filter((c) => (c.bookmarkTime ?? 0) > 0 || c.percentWatched >= 1)
    : all;
  console.log(
    "[api] keep watching: enriched", all.length,
    "→ kept", started.length, startedOnly ? "(started only)" : "(all — watchlist)",
  );
  return dedupeById(started);
};

// My Stuff page: the full bookmark list, enriched with artwork (legacy
// Watchlist tab read my_content movie_bookmarks unfiltered).
export const fetchWatchlist = async () => {
  const { operator_uid, user_id, ready } = clientContext();
  if (!ready) return [];
  try {
    return await fetchKeepWatching(operator_uid, user_id, { startedOnly: false });
  } catch {
    return [];
  }
};

const getCrmClientSettings = async () => {
  const operator_uid = getSelectedOperator().operator_uid;
  const res = await axios.get(`${CM_BASE}/api/client/`, {
    params: { operator_uid, mode: "web" },
  });
  return res.data.status === "ok" ? res.data.data : null;
};

// Same item can appear in several categories/rails — keep the first occurrence
// so list keys stay unique.
const dedupeById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.id ?? item.uid;
    if (key == null || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Map an API content row to the PosterCard-ish fixture shape, defensively.
const toCard = (item) => ({
  id: item.id ?? item.uid,
  image:
    imageUrl(item.image_id ?? item.image_store_id ?? item.image_stores?.[0]?.id) ||
    item.poster_image ||
    item.image ||
    "",
  title: item.title || item.name || "",
  metadata: [item.year ?? item.metadata?.year, item.metadata?.duration]
    .filter(Boolean)
    .join(" · "),
  raw: item,
});

export const fetchHomeContent = async () => {
  const dispatch = store.dispatch;
  if (USE_FIXTURES) {
    console.log("[api] fetchHomeContent: USE_FIXTURES is on — skipping API, fixtures render");
    // Clear the initial loader so pages know fixtures ARE the final content —
    // without this, the fixture-vs-loading gate would never resolve here.
    dispatch(fetchHomeSuccess({}));
    return false; // design-review mode — fixtures render instead
  }
  const { operator_uid, user_id, ready } = clientContext();
  if (!ready) {
    console.log("[api] fetchHomeContent: clientContext not ready (signed out / missing user_info) — fixtures render", { operator_uid, user_id });
    dispatch(fetchHomeSuccess({}));
    return false; // signed out (or bypass) — fixtures render instead
  }

  dispatch(fetchHomeBegin());
  try {
    const packages = await getPackagesString();

    const [settings, banners, keepWatching, channelCategories] = await Promise.all([
      getCrmClientSettings(),
      clientGet(`v1/${operator_uid}/users/${user_id}/banners`).catch(() => null),
      fetchKeepWatching(operator_uid, user_id).catch(() => []),
      clientGet(`v1/${operator_uid}/categories/channels`).catch(() => null),
    ]);

    // Shape discovery while the spec is VPN-only — sample rows for each source.
    if (import.meta.env.DEV) {
      console.log("[api] CRM settings object:", settings);
      console.log("[api] banner sample:", banners?.data?.[0]);
      console.log("[api] keep watching cards:", keepWatching?.length);
      console.log("[api] channel category sample:", channelCategories?.data?.[0]);
    }

    // Brief §6–8: TWO channel categories are injected into the VOD listing — the first
    // right after the first VOD category (id from CRM settings), the second immediately
    // before the LAST VOD category (the category whose uid is `featured`).
    // Until 2026-07-30 `channelCategories` was fetched and only logged, so neither was
    // ever rendered — the homepage showed a fixed "Browse Live Channels" rail instead.
    // The CRM field is `dashboard_channel_category_id` (the brief calls it
    // `dashboard_category_id` — naming drift), so accept either.
    const channelCategoryRows = channelCategories?.status === "ok" ? channelCategories.data : [];
    const firstChannelCategoryId =
      settings?.dashboard_channel_category_id ??
      settings?.dashboard_category_id ??
      settings?.landing_page?.dashboard_channel_category_id ??
      settings?.landing_page?.dashboard_category_id ??
      null;
    const findChannelCategory = (id) =>
      id == null ? null : channelCategoryRows.find((c) => String(c.id) === String(id)) || null;
    const firstChannelCategory = findChannelCategory(firstChannelCategoryId);
    const secondChannelCategory =
      channelCategoryRows.find((c) => (c.uid || "").toLowerCase() === "featured") || null;

    const toChannelRail = async (cat) =>
      cat
        ? {
            id: cat.id,
            uid: cat.uid,
            name: cat.name || cat.title || "",
            items: await fetchLiveChannelCards({ categoryId: cat.id, limit: 12 }).catch(() => []),
          }
        : null;
    const [firstChannelRail, secondChannelRail] = await Promise.all([
      toChannelRail(firstChannelCategory),
      // Skip when it resolves to the same category as the first (don't inject twice).
      toChannelRail(
        secondChannelCategory && secondChannelCategory.id !== firstChannelCategory?.id
          ? secondChannelCategory
          : null
      ),
    ]);
    if (import.meta.env.DEV)
      console.log(
        "[api] channel rails — first:", firstChannelCategory?.name ?? "(none)",
        `(${firstChannelRail?.items.length ?? 0} channels, CRM id ${firstChannelCategoryId})`,
        "| second:", secondChannelCategory?.name ?? "(none)",
        `(${secondChannelRail?.items.length ?? 0} channels)`
      );

    // Brief §9: the promotional banner image is a RANDOM pick from the banners'
    // `preview_image` values. It used to render a hardcoded local GLOTV.svg.
    const previewImageIds = (banners?.data || [])
      .map((b) => b.preview_image_id)
      .filter((id) => id != null);
    const promoBanner = previewImageIds.length
      ? imageUrl(previewImageIds[Math.floor(Math.random() * previewImageIds.length)])
      : null;
    // Its section heading is the CRM's localized `secondbanner` label — the production
    // mobile app renders "Recommended" above this banner, and that string comes from
    // `secondbanner: {ar, en, pt}` in the **app** CRM profile. `✅ VERIFIED` 2026-07-30.
    // ⚠️ The `mode=web` profile we (correctly, per the brief) read does NOT include the
    // field, so "Recommended" is the fallback until the client adds it to the web profile.
    const promoBannerTitle =
      settings?.secondbanner?.en || settings?.secondbanner || "Recommended";

    // VOD rails from the CRM-configured dashboard category ids — verified live:
    // they live under settings.landing_page.dashboard_categories, and the first
    // injected channel category id is settings.dashboard_channel_category_id
    // (the brief's "dashboard_category_id" with slight naming drift).
    const dashboardCategoryIds = settings?.landing_page?.dashboard_categories ?? [];
    if (import.meta.env.DEV) console.log("[api] fetching vod content for:", dashboardCategoryIds);
    let vodRailsRaw = [];
    let categoryNameById = {};
    let brandedGenres = [];
    if (dashboardCategoryIds.length) {
      // Content rows are bare {id, heading_image_id, content} (verified live) —
      // names/uids come from the Categories V2 endpoint, joined by id.
      // v2 + v3 both queried: some dashboard categories only appear in one listing.
      const [content, categoriesV2, categoriesV3] = await Promise.all([
        clientGet(`v1/${operator_uid}/categories/vod/content`, {
          packages,
          categories: dashboardCategoryIds.join(","),
        }).catch(() => null),
        clientGet(`v2/${operator_uid}/categories/vod`, { packages }).catch(() => null),
        clientGet(`v3/${operator_uid}/categories/vod`, { packages }).catch(() => null),
      ]);
      if (import.meta.env.DEV)
        console.log(
          "[api] vod fetch settled — content:", content?.status,
          "v2:", categoriesV2?.status, "v3:", categoriesV3?.status
        );
      vodRailsRaw = content?.status === "ok" ? content.data : [];
      const allCategoryRows = [
        ...(categoriesV3?.status === "ok" ? categoriesV3.data : []),
        ...(categoriesV2?.status === "ok" ? categoriesV2.data : []),
      ];
      allCategoryRows.forEach((cat) => {
        categoryNameById[cat.id] = {
          name: cat.name || cat.title || categoryNameById[cat.id]?.name,
          uid: cat.uid || categoryNameById[cat.id]?.uid,
        };
      });
      // Brief's Genre section = Mango+ Brands: VOD categories with branded=true,
      // rendered halfway through the rails. Image field ⚠ unverified — try the
      // likely spellings; GenreCard falls back to a flat panel when absent.
      const seenBranded = new Set();
      brandedGenres = allCategoryRows
        .filter((cat) => cat.branded === true && !seenBranded.has(cat.id) && seenBranded.add(cat.id))
        .map((cat) => ({
          id: cat.id,
          uid: cat.uid,
          label: cat.name || cat.title || cat.uid || "",
          image: imageUrl(cat.heading_image_id ?? cat.image_id ?? cat.image_store_id) || "",
        }));
      if (import.meta.env.DEV) {
        console.log(
          "[api] branded categories:", brandedGenres.length,
          "sample row:", allCategoryRows.find((c) => c.branded === true)
        );
      }
      if (import.meta.env.DEV)
        console.log("[api] categories v2 sample:", (categoriesV2?.data || [])[0]);
      if (import.meta.env.DEV) {
        console.log("[api] vod content raw response:", content);
        console.log("[api] vod content row count:", vodRailsRaw?.length);
        console.log("[api] vod content first row:", vodRailsRaw?.[0]);
        console.log("[api] vod content first row keys:", vodRailsRaw?.[0] && Object.keys(vodRailsRaw[0]));
        const nested = vodRailsRaw?.[0]?.content?.[0] || vodRailsRaw?.[0]?.movies?.[0];
        console.log("[api] vod first nested item keys:", nested && Object.keys(nested));
      }
    }

    // Dynamic dashboard rails, in CRM-configured order.
    const vodRails = dashboardCategoryIds
      .map((id) => vodRailsRaw.find((c) => c.id === id))
      .filter(Boolean)
      .map((cat) => {
        const uid = cat.uid || categoryNameById[cat.id]?.uid || "";
        // No Top 10 in the brief — but a top-10-style CRM category gets the
        // ranked poster treatment from the design.
        const isTop10 = /top\s*10|top10/i.test(uid) || /top\s*10/i.test(categoryNameById[cat.id]?.name || "");
        const items = dedupeById((cat.content || cat.movies || []).map(toCard));
        return {
          id: cat.id,
          uid,
          name: cat.name || categoryNameById[cat.id]?.name || uid || "",
          isTop10,
          items: isTop10 ? items.map((item, i) => ({ ...item, rank: i + 1 })) : items,
        };
      })
      .filter((rail) => rail.items.length);
    if (import.meta.env.DEV) {
      console.log(
        "[api] mapped vodRails (id → name):",
        vodRails.map((r) => `${r.id} → "${r.name}" (${r.items.length} items)`)
      );
      console.log(
        "[api] dashboard ids missing from content response:",
        dashboardCategoryIds.filter((id) => !vodRailsRaw.some((c) => c.id === id))
      );
    }

    const railByUid = (uid) => {
      const rail = vodRails.find((c) => (c.uid || "").toLowerCase() === uid);
      return rail?.items ?? [];
    };

    // Afrishorts rail (brief): movies with vertical_trailer / vertical_trailer_url_ott
    // + series with has_vertical_trailer=true, from the user movies/series endpoints.
    // The grouped ids feed the vertical_trailer POST on the Shorts screen (api/shorts.js).
    const afrishorts = await (async () => {
      try {
        // Both listing endpoints want the user's packages (legacy pattern; the
        // series one 400s without it).
        const [moviesRes, seriesRes] = await Promise.all([
          clientGet(`v1/${operator_uid}/users/${user_id}/movies`, { packages }).catch(() => null),
          clientGet(`v1/${operator_uid}/users/${user_id}/series`, { packages }).catch(() => null),
        ]);
        const movies = (moviesRes?.status === "ok" ? moviesRes.data : []).filter(
          (m) => m.vertical_trailer || m.vertical_trailer_url_ott
        );

        // User series endpoint returns ids; details (incl. has_vertical_trailer)
        // come from the series endpoint (legacy fetchAllSeries pattern).
        let series = [];
        const seriesIds = seriesRes?.status === "ok" ? seriesRes.data : [];
        if (Array.isArray(seriesIds) && seriesIds.length) {
          const detailsRes = await clientGet(`v1/${operator_uid}/series`, {
            series_id: seriesIds.map((s) => (typeof s === "object" ? s.id : s)).join(","),
          }).catch(() => null);
          series = (detailsRes?.status === "ok" ? detailsRes.data : []).filter(
            (s) => s.has_vertical_trailer
          );
        }

        if (import.meta.env.DEV) {
          console.log("[api] afrishorts movie sample:", movies[0]);
          console.log("[api] afrishorts series sample:", series[0]);
          console.log("[api] afrishorts counts — movies:", movies.length, "series:", series.length);
        }

        // duration = the feature runtime as H:MM, same as the Shorts feed tiles and the
        // production app (see utils/formatRuntime). Without it ShortCard fell back to its
        // hardcoded "0:45" default and every API tile showed a fabricated time.
        return dedupeById([
          ...movies.map((m) => ({ ...toCard(m), contentType: "movie", duration: formatRuntime(m.duration) })),
          ...series.map((s) => ({ ...toCard(s), contentType: "series", duration: formatRuntime(s.duration) })),
        ]);
      } catch {
        return [];
      }
    })();

    // Banner rows carry no genres/rating/title-art — enrich each slide from its
    // linked movie/series details, MangoTV HomePage.loadSlides pattern: genres
    // are ids (movie_genres/genres) mapped through v1/{ouid}/genres {id→name}.
    const genresRes = await clientGet(`v1/${operator_uid}/genres`).catch(() => null);
    const genreMap = {};
    (genresRes?.status === "ok" ? genresRes.data : []).forEach((g) => {
      genreMap[g.id] = g.name || g.title || g.uid || "";
    });

    // contentId → title_art_image_id. `✅ VERIFIED` 2026-07-30 (live probe): this field
    // exists ONLY on **VOD category-content rows** — the movie/series DETAIL records this
    // code enriches from never return it, and `movie_image_stores` comes back `[]`, so the
    // detail-record lookup below could never have found a title art. Build the map from the
    // content rows we already fetched instead.
    const titleArtById = {};
    (Array.isArray(vodRailsRaw) ? vodRailsRaw : []).forEach((row) => {
      (row?.content || row?.movies || []).forEach((i) => {
        if (i?.id != null && i.title_art_image_id != null) titleArtById[String(i.id)] = i.title_art_image_id;
      });
    });
    if (import.meta.env.DEV)
      console.log(
        "[api] title art available for", Object.keys(titleArtById).length, "of",
        (Array.isArray(vodRailsRaw) ? vodRailsRaw : []).reduce((n, r) => n + (r?.content?.length || 0), 0),
        "vod items — 0 means the operator has uploaded no title art (hero then renders its text title)"
      );
    const hero = await Promise.all(
      (banners?.data || []).map(async (b) => {
        const slide = {
          id: b.id,
          backdrop: imageUrl(b.banner_image_id) || "",
          previewImage: imageUrl(b.preview_image_id) || null, // promo banner picks from these
          titleArt: null,
          title: b.title || b.name || "",
          flag: b.flag || null,
          rating: b.rating ?? null,
          maturity: b.maturity ?? null,
          year: b.year ?? null,
          genres: b.genres || [],
          description: b.description || b.subtitle || "",
          raw: b,
        };
        const contentId = b.content_id ?? b.series_content_id;
        if (!contentId) return slide;
        try {
          const isSeries = b.content_id == null && b.series_content_id != null;
          const res = isSeries
            ? await clientGet(`v1/${operator_uid}/series/${contentId}`)
            : await clientGet(`v1/${operator_uid}/users/${user_id}/movies/${contentId}`);
          const d = res?.status === "ok" ? res.data : null;
          if (!d) return slide;
          slide.rating = slide.rating ?? d.user_rating ?? d.critics_rating ?? null;
          slide.year = slide.year ?? d.year ?? null;
          const genreIds = d.movie_genres || d.genres || [];
          if (!slide.genres.length) {
            slide.genres = genreIds
              .map((g) => genreMap[g.id ?? g] || (typeof g === "string" ? g : ""))
              .filter(Boolean);
          }
          if (!slide.description) slide.description = d.description || "";
          // Brief: banners linked to movies/series use the title art. Primary source is the
          // VOD content row (the only place `title_art_image_id` is returned — see the map
          // built above); the detail-record fields are kept as fallbacks in case another
          // operator populates them.
          const storeArt = Array.isArray(d.movie_image_stores)
            ? d.movie_image_stores.find((s) => s.type === "TITLE_ART")?.image_store_id
            : null;
          const artId =
            titleArtById[String(b.content_id ?? b.series_content_id ?? "")] ??
            d.title_art_image_id ??
            storeArt;
          if (artId) slide.titleArt = imageUrl(artId);
        } catch {
          /* slide renders from banner fields alone */
        }
        return slide;
      })
    );

    dispatch(
      fetchHomeSuccess({
        vodRails,
        brandedGenres,
        afriplayShorts: afrishorts,
        hero,
        keepWatching,
        top10Movies: railByUid("afriplaytop10").map((c, i) => ({ ...c, rank: i + 1 })),
        newReleases: railByUid("recentlyadded"),
        onlyOnAfriplay: railByUid("onlyonafriplay"),
        becauseYouWatched: railByUid("trending"),
        // Category rows only carry {id, packages} stubs — details come from v2 channels.
        // The channels list has no images — legacy fetches per-channel details and
        // renders image_stores[0].id. Limit to the rail's visible set.
        browseLiveChannels: await (async () => {
          const channels = dedupeById(await fetchChannels().catch(() => []));
          const detailed = await Promise.all(
            channels.slice(0, 12).map(async (ch) => {
              const info = await fetchChannelInfo(ch.id);
              return {
                id: ch.id,
                image: imageUrl(info?.image_stores?.[0]?.id) || "",
                title: info?.name || info?.title || "",
                uid: info?.uid,
                live: true,
                raw: ch,
              };
            })
          );
          if (import.meta.env.DEV) console.log("[api] channel detail sample:", detailed[0]);
          return detailed.filter((ch) => ch.image);
        })(),
        // Live On Tv Now — real channels + their current EPG programme. Until 2026-07-30
        // this was never dispatched ("still to wire"), and the rail had no API-mode guard,
        // so it rendered DUMMY fixture content on every live page load.
        liveOnTvNow: await fetchLiveChannelCards({ limit: 10 }).catch(() => []),
        firstChannelRail,
        secondChannelRail,
        promoBanner,
        promoBannerTitle,
        // `genres` intentionally unset — the brief's Genre section is `brandedGenres`
        // (VOD categories with branded=true), dispatched above.
      })
    );
    return true;
  } catch (error) {
    console.error("[api] fetchHomeContent failed:", error);
    dispatch(fetchHomeError(error.message));
    return false;
  }
};

/**
 * Movies page (legacy movies.js flow, brief-over-legacy data): the brief's
 * Movies section shows ALL VOD categories (Categories V2/V3 + vod/content —
 * legacy hardcoded rail names instead), plus legacy's genre tabs
 * (v1/{ouid}/genres) filtering the full user movies list into a grid.
 */
export const fetchMoviesPageContent = async () => {
  const dispatch = store.dispatch;
  if (USE_FIXTURES) {
    dispatch(fetchMoviesPageSuccess({}));
    return false; // design-review mode — fixtures render instead
  }
  const { operator_uid, user_id, ready } = clientContext();
  if (!ready) {
    dispatch(fetchMoviesPageSuccess({}));
    return false;
  }

  dispatch(fetchMoviesPageBegin());
  try {
    const packages = await getPackagesString();
    const [categoriesV2, categoriesV3, genresRes, moviesRes] = await Promise.all([
      clientGet(`v2/${operator_uid}/categories/vod`, { packages }).catch(() => null),
      clientGet(`v3/${operator_uid}/categories/vod`, { packages }).catch(() => null),
      clientGet(`v1/${operator_uid}/genres`).catch(() => null),
      clientGet(`v1/${operator_uid}/users/${user_id}/movies`, { packages }).catch(() => null),
    ]);

    // Category names/uids, v3 winning over v2 (home-rail join pattern).
    const categoryNameById = {};
    [
      ...(categoriesV2?.status === "ok" ? categoriesV2.data : []),
      ...(categoriesV3?.status === "ok" ? categoriesV3.data : []),
    ].forEach((cat) => {
      categoryNameById[cat.id] = {
        name: cat.name || cat.title || categoryNameById[cat.id]?.name,
        uid: cat.uid || categoryNameById[cat.id]?.uid,
      };
    });
    const categoryIds = Object.keys(categoryNameById);

    let rails = [];
    if (categoryIds.length) {
      const content = await clientGet(`v1/${operator_uid}/categories/vod/content`, {
        packages,
        categories: categoryIds.join(","),
      }).catch(() => null);
      const rows = content?.status === "ok" ? content.data : [];
      rails = rows
        .map((cat) => {
          const meta = categoryNameById[cat.id] || {};
          const uid = cat.uid || meta.uid || "";
          const isTop10 = /top\s*10|top10/i.test(uid) || /top\s*10/i.test(meta.name || "");
          const items = dedupeById((cat.content || cat.movies || []).map(toCard));
          return {
            id: cat.id,
            uid,
            name: cat.name || meta.name || uid || "",
            isTop10,
            items: isTop10 ? items.map((item, i) => ({ ...item, rank: i + 1 })) : items,
          };
        })
        .filter((rail) => rail.items.length && rail.name);
    }

    // Full movie list for the genre grid; keep raw genre ids on the card.
    const allMovies = (moviesRes?.status === "ok" ? moviesRes.data : []).map((m) => ({
      ...toCard(m),
      genreIds: m.genres || [],
    }));

    const genres = (genresRes?.status === "ok" ? genresRes.data : []).map((g) => ({
      id: g.id,
      uid: g.uid,
      name: g.name || g.title || g.uid || "",
    }));

    if (import.meta.env.DEV)
      console.log(
        "[api] movies page — rails:", rails.length,
        "genres:", genres.length,
        "movies:", allMovies.length,
        "genre sample:", genres[0]
      );

    dispatch(fetchMoviesPageSuccess({ genres, rails, allMovies }));
    return true;
  } catch (error) {
    console.error("[api] fetchMoviesPageContent failed:", error);
    dispatch(fetchMoviesPageError(error.message));
    return false;
  }
};
