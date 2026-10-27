import { clientContext, clientGet, getPackagesString, imageUrl } from "./client";
import store from "../store/store";
import {
  fetchLiveTvBegin,
  fetchLiveTvSuccess,
  fetchLiveTvError,
} from "../store/slice/liveTvSlice";
import { USE_FIXTURES } from "../utils/devFlags";

/**
 * Live TV per the API brief (brief over legacy where they differ):
 *  - Channels: Channels V2 (legacy also used v2 — aligned)
 *  - Categories: v1/{ouid}/categories/channels
 *  - EPG: v2/{ouid}/shows/grid (+ /grid/lite variant per the brief)
 *  - Playout: v1/{ouid}/users/{user_id}/live/channels/{channel_uid}
 *  - Show replay: .../live/channels/{channel_uid}/shows/{show_id}/offset/{offset}
 * ⚠ response shapes unverified against the live spec (behind VPN).
 */

export const fetchChannels = async () => {
  const { operator_uid } = clientContext();
  const packages = await getPackagesString();
  const res = await clientGet(`v2/${operator_uid}/channels`, { packages });
  return res.status === "ok" ? res.data : [];
};

// Channel rows carry no images — logos live in the per-channel details'
// image_stores (legacy MovieCard pattern: fetchChannelInfo → image_stores[0].id).
export const fetchChannelInfo = async (channelId) => {
  const { operator_uid } = clientContext();
  try {
    const res = await clientGet(`v1/${operator_uid}/channels/${channelId}`);
    return res.status === "ok" ? res.data : null;
  } catch {
    return null;
  }
};

export const fetchChannelCategories = async () => {
  const { operator_uid } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/categories/channels`);
  return res.status === "ok" ? res.data : [];
};

// start/end range per MangoTV fetchChannelEPG: ISO start_date/end_date params
// (their TV-guide tabs fetch one midnight→midnight day at a time).
export const fetchEpgGrid = async (channelIds, { lite = false, startDate, endDate } = {}) => {
  const { operator_uid } = clientContext();
  const path = `v2/${operator_uid}/shows/grid${lite ? "/lite" : ""}`;
  const params = { channels: channelIds };
  if (startDate) params.start_date = startDate.toISOString();
  if (endDate) params.end_date = endDate.toISOString();
  const res = await clientGet(path, params);
  return res.status === "ok" ? res.data : [];
};

export const fetchChannelPlayout = async (channelUid) => {
  const { operator_uid, user_id } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/users/${user_id}/live/channels/${channelUid}`);
  return res.status === "ok" ? res.data : null;
};

export const fetchShowReplay = async (channelUid, showId, offset) => {
  const { operator_uid, user_id } = clientContext();
  const res = await clientGet(
    `v1/${operator_uid}/users/${user_id}/live/channels/${channelUid}/shows/${showId}/offset/${offset}`
  );
  return res.status === "ok" ? res.data : null;
};

// ---------- Live TV page thunk (mirrors fetchHomeContent's dispatch pattern) ----------

// EPG timestamps come in an unverified unit (spec behind VPN) — normalize
// seconds-epoch / ms-epoch / ISO strings to ms defensively.
const toMs = (t) => {
  if (t == null) return NaN;
  if (typeof t === "string") return new Date(t).getTime();
  return t < 1e12 ? t * 1000 : t;
};

const timeLabel = (ms) =>
  new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const showTitle = (s) => s?.title || s?.name || s?.show_title || "";

/**
 * Live channel cards for the HOMEPAGE — channel logo + name plus its current EPG
 * programme. Shared by Home's live rail and the brief's two injected channel
 * categories (§6–8), so both use one mapping instead of re-deriving it.
 *
 * `categoryId` limits the set to one channel category. `✅ VERIFIED` 2026-07-21: the
 * category→channel mapping lives on the CATEGORY row (`channels: [{id, packages}]`);
 * channel rows carry no category field, so filtering has to start from the category.
 *
 * Channels are always live, so a channel with no current programme still yields a card
 * with a "No EPG" subtitle — matching the production mobile app, which renders
 * "13:00: No EPG" over the channel name rather than dropping the channel.
 */
export const fetchLiveChannelCards = async ({ categoryId = null, limit = 12 } = {}) => {
  const [channels, categoriesRaw] = await Promise.all([
    fetchChannels().catch(() => []),
    categoryId != null ? fetchChannelCategories().catch(() => []) : Promise.resolve([]),
  ]);

  let pool = Array.isArray(channels) ? channels : [];
  if (categoryId != null) {
    const cat = categoriesRaw.find((c) => String(c.id) === String(categoryId));
    const ids = new Set((cat?.channels || []).map((r) => String(r.id ?? r)));
    pool = pool.filter((c) => ids.has(String(c.id)));
  }
  pool = pool.slice(0, limit);
  if (!pool.length) return [];

  const [detailed, epgRaw] = await Promise.all([
    Promise.all(
      pool.map(async (ch) => {
        const info = await fetchChannelInfo(ch.id).catch(() => null);
        return {
          id: ch.id,
          uid: info?.uid ?? ch.uid,
          image: imageUrl(info?.image_stores?.[0]?.id) || "",
          channel: ch.name || info?.name || info?.title || "",
        };
      })
    ),
    fetchEpgGrid(pool.map((c) => c.id).join(","), { lite: true }).catch(() => []),
  ]);

  const showsByChannel = {};
  (Array.isArray(epgRaw) ? epgRaw : []).forEach((row) => {
    if (Array.isArray(row.shows)) showsByChannel[row.channel_id ?? row.id] = row.shows;
    else if (row.channel_id != null) (showsByChannel[row.channel_id] ??= []).push(row);
  });

  const now = Date.now();
  return detailed
    .filter((ch) => ch.image)
    .map((ch) => {
      const shows = (showsByChannel[ch.id] || [])
        .map((s) => ({
          show: s,
          start: toMs(s.start ?? s.start_time ?? s.startts),
          end: toMs(s.end ?? s.end_time ?? s.endts),
        }))
        .filter((s) => !Number.isNaN(s.start) && !Number.isNaN(s.end));
      const current = shows.find((s) => s.start <= now && now < s.end);
      return {
        id: ch.id,
        uid: ch.uid,
        image: ch.image,
        title: ch.channel,
        subtitle: current
          ? `${timeLabel(current.start)} · ${showTitle(current.show)}`
          : `${timeLabel(now)} · No EPG`,
        progress: current ? (now - current.start) / (current.end - current.start) : 0,
        live: true,
      };
    });
};

/**
 * Fetches channels (+ per-channel details for logos), channel categories, and the
 * EPG grid, then maps them into the fixture shapes LiveTvPage renders:
 * featuredProgram / liveChannels (now-airing cards) / onAirToday (earlier+upcoming).
 * Page falls back to liveTvFixtures for any piece left empty.
 */
export const fetchLiveTvContent = async () => {
  const dispatch = store.dispatch;
  if (USE_FIXTURES) {
    console.log("[api] fetchLiveTvContent: USE_FIXTURES is on — skipping API, fixtures render");
    // Clear the initial loader so the page treats fixtures as final content
    // (same pattern as fetchHomeContent — otherwise the skeleton never resolves).
    dispatch(fetchLiveTvSuccess({}));
    return false;
  }
  const { ready } = clientContext();
  if (!ready) {
    console.log("[api] fetchLiveTvContent: clientContext not ready — fixtures render");
    dispatch(fetchLiveTvSuccess({}));
    return false;
  }

  dispatch(fetchLiveTvBegin());
  try {
    const [channels, categoriesRaw] = await Promise.all([
      fetchChannels(),
      fetchChannelCategories().catch(() => []),
    ]);

    // Tab labels straight from the categories API; "All" is the implicit default.
    const categories = ["All", ...categoriesRaw.map((c) => c.name || c.title).filter(Boolean)];

    // Category→channel mapping lives on the CATEGORY side (verified live
    // 2026-07-21): each category row carries a `channels: [{id, packages}]`
    // array; channel rows/details have no category field. A channel can belong
    // to several categories (e.g. Featured + Sports) — keep them all.
    const categoryNamesByChannelId = {};
    categoriesRaw.forEach((c) => {
      const name = c.name || c.title;
      if (!name) return;
      (c.channels || []).forEach((row) => {
        (categoryNamesByChannelId[row.id] ??= []).push(name);
      });
    });

    // Channel rows carry no images — hydrate details (logo, lcn, category ids)
    // for the visible set, like Home's Browse Live Channels rail.
    const detailed = (
      await Promise.all(
        channels.slice(0, 25).map(async (ch) => {
          const info = await fetchChannelInfo(ch.id);
          if (!info) return null;
          const cats = categoryNamesByChannelId[ch.id] || [];
          return {
            id: ch.id,
            uid: info.uid ?? ch.uid, // playout keys on uid (string), not numeric id
            logo: imageUrl(info.image_stores?.[0]?.id) || "",
            channel: ch.name || info.name || info.title || "",
            lcn: ch.position ?? info.lcn ?? null,
            category: cats[0] || "", // display label
            categories: cats, // full set — tab filtering checks membership
          };
        })
      )
    ).filter(Boolean);

    // EPG for today — lite grid keeps the payload small; shows may nest per
    // channel ({channel_id, shows}) or arrive flat with a channel_id per show.
    const epgRaw = await fetchEpgGrid(channels.map((c) => c.id).join(","), { lite: true }).catch(
      () => []
    );
    if (import.meta.env.DEV) console.log("[api] epg grid sample:", epgRaw?.[0]);
    const showsByChannel = {};
    (Array.isArray(epgRaw) ? epgRaw : []).forEach((row) => {
      if (Array.isArray(row.shows)) {
        showsByChannel[row.channel_id ?? row.id] = row.shows;
      } else if (row.channel_id != null) {
        (showsByChannel[row.channel_id] ??= []).push(row);
      }
    });

    const now = Date.now();
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = startOfDay + 24 * 3600 * 1000;
    const range = (s) => [toMs(s.start ?? s.start_time ?? s.startts), toMs(s.end ?? s.end_time ?? s.endts)];

    // Live-now card per channel + the day's earlier/upcoming schedule rows.
    const liveChannels = [];
    const onAirToday = [];
    detailed.forEach((ch) => {
      const shows = (showsByChannel[ch.id] || [])
        .map((s) => ({ show: s, start: range(s)[0], end: range(s)[1] }))
        .filter((s) => !Number.isNaN(s.start) && !Number.isNaN(s.end))
        .sort((a, b) => a.start - b.start);

      const current = shows.find((s) => s.start <= now && now < s.end);
      const next = shows.find((s) => s.start > now);
      if (current) {
        liveChannels.push({
          ...ch,
          title: showTitle(current.show),
          next: next ? `${showTitle(next.show)} · ${timeLabel(next.start)}` : "",
          progress: (now - current.start) / (current.end - current.start),
          showId: current.show.id,
          start: current.start,
          end: current.end,
        });
      }
      shows
        .filter((s) => s.start >= startOfDay && s.start < endOfDay && s !== current)
        .forEach((s) => {
          onAirToday.push({
            id: `${ch.id}-${s.show.id ?? s.start}`,
            time: timeLabel(s.start),
            category: ch.category,
            categories: ch.categories,
            title: showTitle(s.show),
            channel: ch.channel,
            logo: ch.logo,
            when: s.end <= now ? "earlier" : "upcoming",
            channelUid: ch.uid,
            showId: s.show.id,
            start: s.start,
          });
        });
    });
    onAirToday.sort((a, b) => a.start - b.start);

    // Featured hero = the live program furthest from ending (most watch time
    // left); no match/score metadata in the EPG, so team fields stay null and
    // FeaturedLiveProgram renders its generic layout.
    const featuredSrc = [...liveChannels].sort((a, b) => b.end - a.end)[0];
    const featuredProgram = featuredSrc
      ? {
          id: `featured-${featuredSrc.id}`,
          uid: featuredSrc.uid, // Watch Now → /watch/live/{uid}
          image: featuredSrc.logo,
          status: "LIVE",
          watching: "",
          channelLogo: featuredSrc.logo,
          channelLabel: featuredSrc.lcn
            ? `${featuredSrc.channel} · Ch ${featuredSrc.lcn}`
            : featuredSrc.channel,
          category: featuredSrc.category,
          title: featuredSrc.title,
          subtitle: "",
          startTime: timeLabel(featuredSrc.start),
          endTime: timeLabel(featuredSrc.end),
          remaining: `${Math.max(0, Math.round((featuredSrc.end - now) / 60000))} min remaining`,
          progress: featuredSrc.progress,
        }
      : null;

    if (import.meta.env.DEV) {
      console.log(
        "[api] liveTv mapped — channels:", detailed.length,
        "live now:", liveChannels.length,
        "schedule rows:", onAirToday.length
      );
      // Tab filtering debug: OnAirScheduleSection only shows rows whose category
      // string EXACTLY matches the active tab label — empty/mismatched = hidden.
      const dist = {};
      detailed.forEach((ch) => { dist[ch.category || "(empty)"] = (dist[ch.category || "(empty)"] || 0) + 1; });
      console.log("[api] channel category distribution:", dist, "— tab labels:", categories);
    }

    dispatch(
      fetchLiveTvSuccess({
        categories: categories.length > 1 ? categories : null,
        scheduleDate: new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        featuredProgram,
        onAirToday,
        liveChannels,
        liveChannelsTotal: channels.length,
      })
    );
    return true;
  } catch (error) {
    console.error("[api] fetchLiveTvContent failed:", error);
    dispatch(fetchLiveTvError(error.message));
    return false;
  }
};
