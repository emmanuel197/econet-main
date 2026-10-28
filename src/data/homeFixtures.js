// Local pilot fixtures for Home — stands in for the API until endpoints exist
// (see ../api/fetchMoviesApi.js). Titles/metadata are placeholder copy.

// ── Hero ──────────────────────────────────────────────────────────────────────
import heroBackdrop from "../../assets/images/home-hero-backdrop-stranger-things.webp";
import heroBackdrop02 from "../../assets/images/home-hero-backdrop-stranger-things-02.png";
import heroBackdrop03 from "../../assets/images/home-hero-backdrop-stranger-things-03.jpg";
import heroTitleArt from "../../assets/images/home-hero-title-art-stranger-things.webp";

// ── AfriPlay Shorts (circular thumbnails) ──────────────────────────────────────
import short01 from "../../assets/images/home-afriplay-shorts-thumbnail-01.webp";
import short02 from "../../assets/images/home-afriplay-shorts-thumbnail-02.webp";
import short03 from "../../assets/images/home-afriplay-shorts-thumbnail-03.webp";
import short04 from "../../assets/images/home-afriplay-shorts-thumbnail-04.webp";
import short05 from "../../assets/images/home-afriplay-shorts-thumbnail-05.webp";
import short06 from "../../assets/images/home-afriplay-shorts-thumbnail-06.webp";

// ── Keep Watching (landscape continue cards) ────────────────────────────────────
import kw01 from "../../assets/images/home-keep-watching-card-01-invasion-of-the-mermaids.webp";
import kw02 from "../../assets/images/home-keep-watching-card-02-wonder-woman-3.webp";
import kw03 from "../../assets/images/home-keep-watching-card-03-vis-a-vis.webp";
import kw04 from "../../assets/images/home-keep-watching-card-04-man-of-missions.webp";
import kw05 from "../../assets/images/home-keep-watching-card-05-chief-of-war.webp";

// ── Because You Watched (poster cards) ──────────────────────────────────────────
import byw01 from "../../assets/images/home-because-you-watched-card-01-esin-baba.webp";
import byw02 from "../../assets/images/home-because-you-watched-card-02-citation.webp";
import byw03 from "../../assets/images/home-because-you-watched-card-03-family-fire.webp";
import byw04 from "../../assets/images/home-because-you-watched-card-04-love-spice.webp";
import byw05 from "../../assets/images/home-because-you-watched-card-05-one-last-bite.webp";

// ── Live On TV Now (landscape cards) ────────────────────────────────────────────
import live01 from "../../assets/images/home-live-on-tv-now-card-01-supersport-premier.webp";
import live02 from "../../assets/images/home-live-on-tv-now-card-02-the-bayou.webp";
import live03 from "../../assets/images/home-live-on-tv-now-card-03-acrimony-2.webp";
import live04 from "../../assets/images/home-live-on-tv-now-card-04-squid-game.webp";
import live05 from "../../assets/images/home-live-on-tv-now-card-05-nowhere.webp";

// ── Top 10 Movies (poster cards, ranked) ────────────────────────────────────────
import top01 from "../../assets/images/home-top-10-movies-card-01-prison-break.webp";
import top02 from "../../assets/images/home-top-10-movies-card-02-soyayya-ruwan-zuma.webp";
import top03 from "../../assets/images/home-top-10-movies-card-03-a-danfo-christmas.webp";
import top04 from "../../assets/images/home-top-10-movies-card-04-baby-driver.webp";
import top05 from "../../assets/images/home-top-10-movies-card-05-sweet-home.webp";

// ── Genres (category cards) ─────────────────────────────────────────────────────
import genre01 from "../../assets/images/home-genres-card-01-action.webp";
import genre02 from "../../assets/images/home-genres-card-02-comedy.webp";
import genre03 from "../../assets/images/home-genres-card-03-drama.webp";
import genre04 from "../../assets/images/home-genres-card-04-sci-fi.webp";
import genre05 from "../../assets/images/home-genres-card-05-kids-and-family.webp";

// ── New Release on AfriPlay (poster cards) ──────────────────────────────────────
import nr01 from "../../assets/images/home-new-release-on-afriplay-card-01-love-in-every-word.webp";
import nr02 from "../../assets/images/home-new-release-on-afriplay-card-02-soyayya-ruwan-zuma.webp";
import nr03 from "../../assets/images/home-new-release-on-afriplay-card-03-1992.webp";
import nr04 from "../../assets/images/home-new-release-on-afriplay-card-04-the-passage.webp";
import nr05 from "../../assets/images/home-new-release-on-afriplay-card-05-sweet-girl.webp";

// ── Browse Live Channels (channel cards) ────────────────────────────────────────
import ch01 from "../../assets/images/home-browse-live-channels-channel-card-01.webp";
import ch02 from "../../assets/images/home-browse-live-channels-channel-card-02.webp";
import ch03 from "../../assets/images/home-browse-live-channels-channel-card-03.webp";
import ch04 from "../../assets/images/home-browse-live-channels-channel-card-04.webp";
import ch05 from "../../assets/images/home-browse-live-channels-channel-card-05.webp";

// ── Only on AfriPlay (poster cards) ─────────────────────────────────────────────
import only01 from "../../assets/images/home-only-on-afriplay-card-01-the-game.webp";
import only02 from "../../assets/images/home-only-on-afriplay-card-02-the-chi.webp";
import only03 from "../../assets/images/home-only-on-afriplay-card-03-wure.webp";

// WONA mobile-only sections
import bundle01 from "../../assets/images/home-mobile-wona-bundle-promo-card-01.webp";
import upcomingWide01 from "../../assets/images/home-mobile-upcoming-tv-shows-card-01.webp";
import upcomingWide02 from "../../assets/images/home-mobile-upcoming-tv-shows-card-02.webp";

export const heroSlides = [
  {
    id: "stranger-things",
    backdrop: heroBackdrop,
    titleArt: heroTitleArt,
    flag: "Season 4 Finale",
    rating: "8.6",
    maturity: "TV-MA",
    year: "2016",
    genres: ["Drama", "Sci-Fi", "Horror", "Teen"],
    description:
      "Eleven, a girl with psychokinetic powers, escapes a secret government lab and is sheltered by three boys who are searching for their missing friend in their small Indiana town.",
  },
  // Slides 2–3: backdrops from Figma frames 2659-962 / 2659-1227 (same title copy,
  // different key art). Source fills top out at 750×375 / 1280×720 — acceptable
  // because the design renders the backdrop blurred.
  {
    id: "stranger-things-2",
    backdrop: heroBackdrop02,
    titleArt: heroTitleArt,
    flag: "Season 4 Finale",
    rating: "8.6",
    maturity: "TV-MA",
    year: "2016",
    genres: ["Drama", "Sci-Fi", "Horror", "Teen"],
    description:
      "Eleven, a girl with psychokinetic powers, escapes a secret government lab and is sheltered by three boys who are searching for their missing friend in their small Indiana town.",
  },
  {
    id: "stranger-things-3",
    backdrop: heroBackdrop03,
    titleArt: heroTitleArt,
    flag: "Season 4 Finale",
    rating: "8.6",
    maturity: "TV-MA",
    year: "2016",
    genres: ["Drama", "Sci-Fi", "Horror", "Teen"],
    description:
      "Eleven, a girl with psychokinetic powers, escapes a secret government lab and is sheltered by three boys who are searching for their missing friend in their small Indiana town.",
  },
];

export const afriplayShorts = [
  { id: "s1", image: short01, duration: "0:45" },
  { id: "s2", image: short02, duration: "0:45" },
  { id: "s3", image: short03, duration: "0:45" },
  { id: "s4", image: short04, duration: "0:45" },
  { id: "s5", image: short05, duration: "1:00" },
  { id: "s6", image: short06, duration: "1:15" },
];

export const keepWatching = [
  { id: "kw1", image: kw01, title: "Invasion of The Mermaids", subtitle: "65% watched · 35 min left" },
  { id: "kw2", image: kw02, title: "Wonder Woman 3", subtitle: "20% watched · 1h 32 min left" },
  { id: "kw3", image: kw03, title: "Vis a Vis", subtitle: "48% watched · 22 min left" },
  { id: "kw4", image: kw04, title: "Man of Missions", subtitle: "80% watched · 18 min left" },
  { id: "kw5", image: kw05, title: "Chief of War", subtitle: "10% watched · 49 min left" },
];

export const becauseYouWatched = [
  { id: "byw1", image: byw01, title: "Esin Baba", metadata: "2024 · 1h 53m" },
  { id: "byw2", image: byw02, title: "Citation", metadata: "2020 · 2h 31m" },
  { id: "byw3", image: byw03, title: "Family Fire", metadata: "2020 · 4 Episodes" },
  { id: "byw4", image: byw04, title: "Love & Spice", metadata: "2023 · 1h 47m" },
  { id: "byw5", image: byw05, title: "One Last Bite", metadata: "2022 · 1h 38m" },
];

export const liveOnTvNow = [
  { id: "l1", image: live01, title: "SuperSport Premier", subtitle: "LIVE · Premier League" },
  { id: "l2", image: live02, title: "The Bayou", subtitle: "LIVE · Drama" },
  { id: "l3", image: live03, title: "Acrimony 2", subtitle: "LIVE · Thriller" },
  { id: "l4", image: live04, title: "Squid Game", subtitle: "LIVE · Series" },
  { id: "l5", image: live05, title: "Nowhere", subtitle: "LIVE · Movie" },
];

export const top10Movies = [
  { id: "t1", image: top01, title: "Prison Break", metadata: "2024 · Series", rank: 1 },
  { id: "t2", image: top02, title: "Soyayya Ruwan Zuma", metadata: "2024 · 1h 58m", rank: 2 },
  { id: "t3", image: top03, title: "A Danfo Christmas", metadata: "2023 · 1h 42m", rank: 3 },
  { id: "t4", image: top04, title: "Baby Driver", metadata: "2017 · 1h 53m", rank: 4 },
  { id: "t5", image: top05, title: "Sweet Home", metadata: "2024 · Series", rank: 5 },
];

export const genres = [
  { id: "g1", image: genre01, label: "Action" },
  { id: "g2", image: genre02, label: "Comedy" },
  { id: "g3", image: genre03, label: "Drama" },
  { id: "g4", image: genre04, label: "Sci-Fi" },
  { id: "g5", image: genre05, label: "Kids & Family" },
];

export const newReleases = [
  { id: "n1", image: nr01, title: "Love in Every Word", metadata: "2024 · 1h 55m" },
  { id: "n2", image: nr02, title: "Soyayya Ruwan Zuma", metadata: "2024 · 1h 58m" },
  { id: "n3", image: nr03, title: "1992", metadata: "2024 · 1h 47m" },
  { id: "n4", image: nr04, title: "The Passage", metadata: "2023 · 1h 39m" },
  { id: "n5", image: nr05, title: "Sweet Girl", metadata: "2021 · 1h 50m" },
];

export const browseLiveChannels = [
  { id: "c1", image: ch01, live: true },
  { id: "c2", image: ch02, live: true },
  { id: "c3", image: ch03, live: true },
  { id: "c4", image: ch04, live: true },
  { id: "c5", image: ch05, live: true },
];

// Promotional ad banner between "Live On Tv Now" and "Top 10 Movies". The live app will
// pick this randomly from the Banner API's preview_image values; the fixture uses the
// GLO TV "Zapping" poster ad. Save the ad as
// assets/images/home-promo-banner-glo-tv-zapping.webp, then uncomment the import below.
// import promoBannerImage from "../../assets/images/home-promo-banner-glo-tv-zapping.webp";
export const promoBanner = {
  id: "promo-glo-tv-zapping",
  image: null, // ← promoBannerImage once the asset lands (PromoBanner renders nothing while null)
  alt: "Zapping — stream this movie now on the GLO TV app",
  href: null,
};

export const onlyOnAfriplay = [
  { id: "o1", image: only01, title: "The Game", metadata: "2024 · Series" },
  { id: "o2", image: only02, title: "The Chi", metadata: "2023 · Series" },
  { id: "o3", image: only03, title: "Wúre", metadata: "2024 · 1h 44m" },
];

export const upcomingTvShows = [
  { id: "up1", image: kw04, title: "Man of Missions", metadata: "Jun 30" },
  { id: "up2", image: top05, title: "Sweet Home", metadata: "Jul 12" },
  { id: "up3", image: kw05, title: "Chief of War", metadata: "Aug 02" },
  { id: "up4", image: nr04, title: "The Passage", metadata: "Aug 18" },
  { id: "up5", image: byw02, title: "Citation", metadata: "Sep 01" },
];

// Advertiser banner slot (between Live On TV Now and Top 10) — placeholder copy
// modeled on the GLO TV reference ad; no real ad creative/source exists yet.
export const adBanner = {
  id: "ad-1",
  headline: "One mistake. A deadly spread.",
  accentWord: "deadly",
  tagline: "The outbreak begins!",
  ctaText: "Stream this movie now on the GLO TV app",
  poster: nr03,
  brand: "glo TV",
};

// ── Mobile-only sections from the WONA mobile home comp (4041:1205) ──
// Trending Now reuses the Top 10 posters without rank numerals (as in the comp).
export const trendingNow = top10Movies.map(({ rank, ...m }) => ({ ...m, id: `tr-${m.id}` })); // eslint-disable-line no-unused-vars

export const wonaBundles = [
  { id: "wb1", image: bundle01, title: "Wona Bundle", features: ["Live TV", "Movies", "+ Shorts"] },
  { id: "wb2", image: bundle01, title: "Wona Bundle", features: ["Live TV", "Movies", "+ Shorts"] },
];

// Mobile Upcoming TV Shows uses wide 245×303 cards with their own artwork.
export const upcomingTvShowsMobile = [
  { id: "upm1", image: upcomingWide01, title: "Upcoming show" },
  { id: "upm2", image: upcomingWide02, title: "Upcoming show" },
];

// Single object mirroring the homeSlice shape — HomePage reads this until the API lands.
export const homeFixtures = {
  hero: heroSlides,
  afriplayShorts,
  keepWatching,
  becauseYouWatched,
  liveOnTvNow,
  promoBanner,
  top10Movies,
  genres,
  newReleases,
  browseLiveChannels,
  onlyOnAfriplay,
  upcomingTvShows,
  adBanner,
  trendingNow,
  wonaBundles,
  upcomingTvShowsMobile,
};
