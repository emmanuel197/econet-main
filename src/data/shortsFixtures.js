// Local pilot fixtures for the Shorts screens (feed + player).
// Stands in for the API until endpoints exist (see ../api/shorts.js).

// ── Shorts For You rail (circular thumbnails) ───────────────────────────────────
// Only 3 dedicated rail thumbnails shipped; reuses the 6 home-afriplay-shorts ones
// to fill the row to 9 items.
import railA from "../../assets/images/shorts-feed-shorts-for-you-shorts-rail-thumbnail-04.webp";
import railB from "../../assets/images/shorts-feed-shorts-for-you-shorts-rail-thumbnail-08.webp";
import railC from "../../assets/images/shorts-feed-shorts-for-you-shorts-rail-thumbnail-09.webp";
import railD from "../../assets/images/home-afriplay-shorts-thumbnail-01.webp";
import railE from "../../assets/images/home-afriplay-shorts-thumbnail-02.webp";
import railF from "../../assets/images/home-afriplay-shorts-thumbnail-03.webp";
import railG from "../../assets/images/home-afriplay-shorts-thumbnail-04.webp";
import railH from "../../assets/images/home-afriplay-shorts-thumbnail-05.webp";
import railI from "../../assets/images/home-afriplay-shorts-thumbnail-06.webp";

// ── For You grid (16 posters) ───────────────────────────────────────────────────
import g01 from "../../assets/images/shorts-feed-for-you-grid-poster-01.webp";
import g02 from "../../assets/images/shorts-feed-for-you-grid-poster-02.webp";
import g03 from "../../assets/images/shorts-feed-for-you-grid-poster-03.webp";
import g04 from "../../assets/images/shorts-feed-for-you-grid-poster-04.webp";
import g05 from "../../assets/images/shorts-feed-for-you-grid-poster-05.webp";
import g06 from "../../assets/images/shorts-feed-for-you-grid-poster-06.webp";
import g07 from "../../assets/images/shorts-feed-for-you-grid-poster-07.webp";
import g08 from "../../assets/images/shorts-feed-for-you-grid-poster-08.webp";
import g09 from "../../assets/images/shorts-feed-for-you-grid-poster-09.webp";
import g10 from "../../assets/images/shorts-feed-for-you-grid-poster-10.webp";
import g11 from "../../assets/images/shorts-feed-for-you-grid-poster-11.webp";
import g12 from "../../assets/images/shorts-feed-for-you-grid-poster-12.webp";
import g13 from "../../assets/images/shorts-feed-for-you-grid-poster-13.webp";
import g14 from "../../assets/images/shorts-feed-for-you-grid-poster-14.webp";
import g15 from "../../assets/images/shorts-feed-for-you-grid-poster-15.webp";
import g16 from "../../assets/images/shorts-feed-for-you-grid-poster-16.webp";

// ── Live Reel Preview (right-sidebar featured) ──────────────────────────────────
import livePreviewBg from "../../assets/images/shorts-feed-live-reel-preview-card-reel-preview-bg.webp";

// ── Trending Now (right-sidebar 6 items) ────────────────────────────────────────
import t01 from "../../assets/images/shorts-feed-trending-now-trend-01-afcon-2024-highlights.webp";
import t02 from "../../assets/images/shorts-feed-trending-now-trend-02-afrobeats-top-20.webp";
import t03 from "../../assets/images/shorts-feed-trending-now-trend-03-best-of-nollywood.webp";
import t04 from "../../assets/images/shorts-feed-trending-now-trend-04-finest-cuisine.webp";
import t05 from "../../assets/images/shorts-feed-trending-now-trend-05-gourmet-delights.webp";
import t06 from "../../assets/images/shorts-feed-trending-now-trend-06-exquisite-flavors.webp";

// ── Player assets ────────────────────────────────────────────────────────────────
import reelVideo from "../../assets/images/comments-reel-player-reel-video.webp";
import reelGlow from "../../assets/illustrations/comments-reel-player-reel-glow-ellipse.webp";
import creatorAvatar from "../../assets/images/comments-reel-action-rail-follow-avatar.webp";
import incomingReelBg from "../../assets/images/shorts-play-incoming-reel-incoming-reel-bg.webp";

export const shortsForYou = [
  { id: "sr1", image: railA, duration: "0:45" },
  { id: "sr2", image: railB, duration: "1:00" },
  { id: "sr3", image: railC, duration: "0:38" },
  { id: "sr4", image: railD, duration: "0:50" },
  { id: "sr5", image: railE, duration: "0:42" },
  { id: "sr6", image: railF, duration: "1:12" },
  { id: "sr7", image: railG, duration: "0:55" },
  { id: "sr8", image: railH, duration: "0:30" },
  { id: "sr9", image: railI, duration: "0:48" },
];

export const forYouGrid = [
  { id: "fy1",  image: g01, title: "Street Dance Battle Lagos",  duration: "0:47", views: "1.5M" },
  { id: "fy2",  image: g02, title: "Jollof Wars Ep. 2",          duration: "0:47", views: "1.5M" },
  { id: "fy3",  image: g03, title: "Couch Talk Sessions",        duration: "0:47", views: "1.5M" },
  { id: "fy4",  image: g04, title: "New Year's Eve Vibes",       duration: "0:47", views: "1.5M" },
  { id: "fy5",  image: g05, title: "Nairobi Night Market Tour",  duration: "0:47", views: "1.5M" },
  { id: "fy6",  image: g06, title: "Highlife Mixtape Vol.2",     duration: "0:47", views: "1.5M" },
  { id: "fy7",  image: g07, title: "Festival Frenzy",            duration: "0:47", views: "1.5M" },
  { id: "fy8",  image: g08, title: "Rise Of Robots",             duration: "0:47", views: "1.5M" },
  { id: "fy9",  image: g09, title: "Cape Town Culinary Adventure", duration: "0:47", views: "1.5M" },
  { id: "fy10", image: g10, title: "Friedrice Wars Ep. 3",       duration: "0:47", views: "1.5M" },
  { id: "fy11", image: g11, title: "Street Canvas",              duration: "0:47", views: "1.5M" },
  { id: "fy12", image: g12, title: "Urban Green Farming",        duration: "0:47", views: "1.5M" },
  { id: "fy13", image: g13, title: "Nairobi Night Market Tour",  duration: "0:47", views: "1.5M" },
  { id: "fy14", image: g14, title: "Cape Town Culinary Adventure", duration: "0:47", views: "1.5M" },
  { id: "fy15", image: g15, title: "Good Energy Only",           duration: "0:47", views: "1.5M" },
  { id: "fy16", image: g16, title: "Hands Of Clay",              duration: "0:47", views: "1.5M" },
];

export const liveReelPreview = {
  id: "live-1",
  image: livePreviewBg,
  title: "Top 10 African Football Goals 2024",
  views: "1.5M views",
};

export const trendingNow = [
  { id: "tn1", rank: 1, image: t01, title: "AFCON 2024 Highlights", views: "1.5M" },
  { id: "tn2", rank: 2, image: t02, title: "Afrobeats Top 20",      views: "1.5M" },
  { id: "tn3", rank: 3, image: t03, title: "Best Of Nollywood",     views: "1.5M" },
  { id: "tn4", rank: 4, image: t04, title: "Finest Cuisine",        views: "1.5M" },
  { id: "tn5", rank: 5, image: t05, title: "Gourmet Delights",      views: "1.5M" },
  { id: "tn6", rank: 6, image: t06, title: "Exquisite Flavors",     views: "1.5M" },
];

// ── Reels (player payload) ──────────────────────────────────────────────────────
// One record per playable reel, id matches /shorts/:id. All reels reuse the same
// video asset (only one shipped) with different metadata.
const makeReel = ({ id, badge, handle, title, hashtags, audio }) => ({
  id,
  badge,
  handle,
  title,
  hashtags,
  audio,
  video: reelVideo,           // shared frame asset (no per-reel renders shipped)
  glow: reelGlow,
  creatorAvatar,
  likes: "43k",
  duration: "0:45",
  progress: 0.47,             // 0..1 range
  currentTime: "0:21",
  totalTime: "0:45",
});

export const reels = [
  makeReel({
    id: "reel-1",
    badge: "Highlights",
    handle: "@AfriSportsHQ",
    title: "Top 10 African football moments of 2024",
    hashtags: ["#Wona", "#Football", "#AFCON2024"],
    audio: "Original audio · AfriSportsHQ",
  }),
  makeReel({
    id: "reel-2",
    badge: "Trending",
    handle: "@AfrobeatsDaily",
    title: "Afrobeats Top 20 — this week",
    hashtags: ["#Wona", "#Afrobeats", "#Top20"],
    audio: "Original audio · AfrobeatsDaily",
  }),
  makeReel({
    id: "reel-3",
    badge: "Comedy",
    handle: "@NollywoodCuts",
    title: "Best comedy scenes from Nollywood",
    hashtags: ["#Wona", "#Nollywood", "#Comedy"],
    audio: "Original audio · NollywoodCuts",
  }),
];

// Feed tiles link to ids with no dedicated `reels` entry — the circular rail
// (sr1..sr9), For You grid (fy1..fy16), Trending Now (tn1..tn6) and the LIVE hero
// (live-1). This synthesizes a minimal reel from the matching item when there's no
// direct match, keeping every feed tile clickable.
export function resolveReel(id) {
  const direct = reels.find((r) => r.id === id);
  if (direct) return direct;

  const gridItem = forYouGrid.find((i) => i.id === id);
  const trendItem = trendingNow.find((i) => i.id === id);
  const railItem = shortsForYou.find((i) => i.id === id);
  const liveItem = liveReelPreview.id === id ? liveReelPreview : null;
  const source = gridItem ?? trendItem ?? liveItem ?? railItem;
  if (!source) return null;

  const badge = trendItem ? "Trending" : liveItem ? "Live" : gridItem ? "For You" : "Shorts";
  return makeReel({
    id: source.id,
    badge,
    handle: "@Wona",
    title: source.title ?? "AfriShorts clip",
    hashtags: ["#Wona"],
    audio: "Original audio · WONA",
  });
}

// Incoming-reel preview asset (peeks below the current reel when scrolling).
export { incomingReelBg };

// Single object mirroring the shortsSlice shape — pages read this until API lands.
export const shortsFixtures = {
  shortsForYou,
  forYouGrid,
  liveReelPreview,
  trendingNow,
  reels,
};
