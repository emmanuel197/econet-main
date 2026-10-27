// Local pilot fixtures for Search — no search endpoint yet (see ../api/search.js).
// `library` stands in for a searchable catalog; results/recommended filter it client-side.
// Titles for the dedicated search-recommended-* poster set are placeholder copy (filenames
// don't carry titles).

// ── Catalog reused from Home (real titles/metadata) ─────────────────────────────
import top01 from "../../assets/images/home-top-10-movies-card-01-prison-break.webp";
import top02 from "../../assets/images/home-top-10-movies-card-02-soyayya-ruwan-zuma.webp";
import top03 from "../../assets/images/home-top-10-movies-card-03-a-danfo-christmas.webp";
import top04 from "../../assets/images/home-top-10-movies-card-04-baby-driver.webp";
import top05 from "../../assets/images/home-top-10-movies-card-05-sweet-home.webp";
import nr01 from "../../assets/images/home-new-release-on-afriplay-card-01-love-in-every-word.webp";
import nr02 from "../../assets/images/home-new-release-on-afriplay-card-02-soyayya-ruwan-zuma.webp";
import nr03 from "../../assets/images/home-new-release-on-afriplay-card-03-1992.webp";
import nr04 from "../../assets/images/home-new-release-on-afriplay-card-04-the-passage.webp";
import nr05 from "../../assets/images/home-new-release-on-afriplay-card-05-sweet-girl.webp";
import byw01 from "../../assets/images/home-because-you-watched-card-01-esin-baba.webp";
import byw03 from "../../assets/images/home-because-you-watched-card-03-family-fire.webp";
import byw04 from "../../assets/images/home-because-you-watched-card-04-love-spice.webp";
import only01 from "../../assets/images/home-only-on-afriplay-card-01-the-game.webp";
import only02 from "../../assets/images/home-only-on-afriplay-card-02-the-chi.webp";
import only03 from "../../assets/images/home-only-on-afriplay-card-03-wure.webp";
import ch01 from "../../assets/images/home-browse-live-channels-channel-card-01.webp";
import ch02 from "../../assets/images/home-browse-live-channels-channel-card-02.webp";
import ch03 from "../../assets/images/home-browse-live-channels-channel-card-03.webp";
import ch04 from "../../assets/images/home-browse-live-channels-channel-card-04.webp";
import ch05 from "../../assets/images/home-browse-live-channels-channel-card-05.webp";

// ── Browse by Categories (dedicated search assets — only 4 shipped) ─────────────
import cat06 from "../../assets/images/search-browse-by-categories-category-06-horror.webp";
import cat07 from "../../assets/images/search-browse-by-categories-category-07-documentary.webp";
import cat08 from "../../assets/images/search-browse-by-categories-category-08-ai-clips.webp";
import cat09 from "../../assets/images/search-browse-by-categories-category-09-animation.webp";

// ── Recommended posters (dedicated search assets, 18 shipped) ───────────────────
import rec01 from "../../assets/images/search-recommended-poster-01.webp";
import rec02 from "../../assets/images/search-recommended-poster-02.webp";
import rec03 from "../../assets/images/search-recommended-poster-03.webp";
import rec04 from "../../assets/images/search-recommended-poster-04.webp";
import rec05 from "../../assets/images/search-recommended-poster-05.webp";
import rec06 from "../../assets/images/search-recommended-poster-06.webp";
import rec07 from "../../assets/images/search-recommended-poster-07.webp";
import rec08 from "../../assets/images/search-recommended-poster-08.webp";
import rec09 from "../../assets/images/search-recommended-poster-09.webp";
import rec10 from "../../assets/images/search-recommended-poster-10.webp";
import rec11 from "../../assets/images/search-recommended-poster-11.webp";
import rec12 from "../../assets/images/search-recommended-poster-12.webp";
import rec13 from "../../assets/images/search-recommended-poster-13.webp";
import rec14 from "../../assets/images/search-recommended-poster-14.webp";
import rec15 from "../../assets/images/search-recommended-poster-15.webp";
import rec16 from "../../assets/images/search-recommended-poster-16.webp";
import rec17 from "../../assets/images/search-recommended-poster-17.webp";
import rec18 from "../../assets/images/search-recommended-poster-18.webp";

// ── Best Result hero (Figma "results-featured-result") ──────────────────────────
import bestResultBg from "../../assets/images/results-featured-result-best-result-hero-bg.webp";
import bestResultTitleArt from "../../assets/images/results-featured-result-best-result-title-art.webp";

export const recentSearches = ["Prison Break", "Vis a Vis", "Squid Game", "Baby Driver"];

export const trendingSearches = [
  { id: "ts1", label: "Soyayya Ruwan Zuma" },
  { id: "ts2", label: "Chief of War" },
  { id: "ts3", label: "The Chi" },
  { id: "ts4", label: "1992" },
  { id: "ts5", label: "Sweet Home" },
  { id: "ts6", label: "Family Fire" },
];

// Not currently rendered — SearchPage's landing category grid uses homeFixtures.genres
// instead. Kept in case a later screen needs this dedicated set.
export const browseCategories = [
  { id: "cat-horror", image: cat06, label: "Horror" },
  { id: "cat-doc", image: cat07, label: "Documentary" },
  { id: "cat-ai", image: cat08, label: "AI Clips" },
  { id: "cat-animation", image: cat09, label: "Animation" },
];

// Plain-text genre/tag pills under the search bar — clicking one commits a search
// for that label, same as the category cards.
export const genreChips = [
  "New",
  "Thriller",
  "Stand-Up",
  "Events",
  "WONA Originals",
  "Fantasy",
  "Crime",
  "War & Military",
  "4K HDR",
  "Nollywood",
  "Reality TV",
  "Talk Shows",
  "Sports",
];

// Unified searchable catalog; `type` drives the result-type tabs.
export const library = [
  { id: "lib-top01", image: top01, title: "Prison Break", metadata: "2024 · Series", type: "show" },
  { id: "lib-top02", image: top02, title: "Soyayya Ruwan Zuma", metadata: "2024 · 1h 58m", type: "movie" },
  { id: "lib-top03", image: top03, title: "A Danfo Christmas", metadata: "2023 · 1h 42m", type: "movie" },
  { id: "lib-top04", image: top04, title: "Baby Driver", metadata: "2017 · 1h 53m", type: "movie" },
  { id: "lib-top05", image: top05, title: "Sweet Home", metadata: "2024 · Series", type: "show" },
  { id: "lib-nr01", image: nr01, title: "Love in Every Word", metadata: "2024 · 1h 55m", type: "movie" },
  { id: "lib-nr02", image: nr02, title: "Soyayya Ruwan Zuma II", metadata: "2024 · 1h 51m", type: "movie" },
  { id: "lib-nr03", image: nr03, title: "1992", metadata: "2024 · 1h 47m", type: "movie" },
  { id: "lib-nr04", image: nr04, title: "The Passage", metadata: "2023 · 1h 39m", type: "movie" },
  { id: "lib-nr05", image: nr05, title: "Sweet Girl", metadata: "2021 · 1h 50m", type: "movie" },
  { id: "lib-byw01", image: byw01, title: "Esin Baba", metadata: "2024 · 1h 53m", type: "movie" },
  { id: "lib-byw03", image: byw03, title: "Family Fire", metadata: "2020 · 4 Episodes", type: "show" },
  { id: "lib-byw04", image: byw04, title: "Love & Spice", metadata: "2023 · 1h 47m", type: "movie" },
  { id: "lib-only01", image: only01, title: "The Game", metadata: "2024 · Series", type: "show" },
  { id: "lib-only02", image: only02, title: "The Chi", metadata: "2023 · Series", type: "show" },
  { id: "lib-only03", image: only03, title: "Wúre", metadata: "2024 · 1h 44m", type: "movie" },
  { id: "lib-rec01", image: rec01, title: "Golden Coast", metadata: "2024 · 1h 49m", type: "movie" },
  { id: "lib-rec02", image: rec02, title: "Market Queens", metadata: "2023 · Series", type: "show" },
  { id: "lib-rec03", image: rec03, title: "Harmattan", metadata: "2022 · 2h 04m", type: "movie" },
  { id: "lib-rec04", image: rec04, title: "Diamond Trail", metadata: "2024 · 1h 58m", type: "movie" },
  { id: "lib-rec05", image: rec05, title: "Lagos Nights", metadata: "2023 · Series", type: "show" },
  { id: "lib-rec06", image: rec06, title: "Whispers of Accra", metadata: "2021 · 1h 42m", type: "movie" },
  { id: "lib-rec07", image: rec07, title: "Return to Kumasi", metadata: "2024 · 1h 33m", type: "movie" },
  { id: "lib-rec08", image: rec08, title: "Coastal Fire", metadata: "2022 · 1h 51m", type: "movie" },
  { id: "lib-rec09", image: rec09, title: "The Baobab House", metadata: "2023 · Series", type: "show" },
  { id: "lib-rec10", image: rec10, title: "Ashanti Gold", metadata: "2024 · 2h 11m", type: "movie" },
  { id: "lib-rec11", image: rec11, title: "River of Dreams", metadata: "2020 · 1h 47m", type: "movie" },
  { id: "lib-rec12", image: rec12, title: "Midnight Jollof", metadata: "2024 · Series", type: "show" },
  { id: "lib-rec13", image: rec13, title: "Savannah Skies", metadata: "2023 · 1h 39m", type: "movie" },
  { id: "lib-rec14", image: rec14, title: "The Palm Wine Tapper", metadata: "2019 · 1h 28m", type: "movie" },
  { id: "lib-rec15", image: rec15, title: "Ndewo", metadata: "2024 · 1h 45m", type: "movie" },
  { id: "lib-rec16", image: rec16, title: "Zongo Street", metadata: "2022 · Series", type: "show" },
  { id: "lib-rec17", image: rec17, title: "Highlife Forever", metadata: "2024 · 1h 36m", type: "movie" },
  { id: "lib-rec18", image: rec18, title: "Cocoa Dreams", metadata: "2021 · 1h 58m", type: "movie" },
  { id: "lib-ch01", image: ch01, title: "Wona Sports 1", metadata: "TV Channel", type: "channel" },
  { id: "lib-ch02", image: ch02, title: "Wona Movies", metadata: "TV Channel", type: "channel" },
  { id: "lib-ch03", image: ch03, title: "Wona News", metadata: "TV Channel", type: "channel" },
  { id: "lib-ch04", image: ch04, title: "Wona Kids", metadata: "TV Channel", type: "channel" },
  { id: "lib-ch05", image: ch05, title: "Wona Music", metadata: "TV Channel", type: "channel" },
];

export const recommended = library.slice(6);

export const bestResult = {
  title: "Prison Break",
  titleArt: bestResultTitleArt,
  backdrop: bestResultBg,
  match: "98% Match",
  rating: "8.5",
  maturity: "TV-14",
  year: "2024",
  metadata: "5 Seasons",
  genres: ["Drama", "Thriller", "Crime"],
  description:
    "Wrongly convicted of a crime he didn't commit, a structural engineer conspires to help his brother break out of prison — from the inside.",
};

// Assumption (see wiki/pages/open-questions.md): min query length before results fire.
export const MIN_QUERY_LENGTH = 2;

export const searchFixtures = {
  recentSearches,
  trendingSearches,
  browseCategories,
  genreChips,
  library,
  recommended,
  bestResult,
  MIN_QUERY_LENGTH,
};
