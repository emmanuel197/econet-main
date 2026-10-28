// "More" tab sample data — WONA mobile comps More1–More15 (assets/wonastuff, 2026-10-28).
// No My Library (rentals/purchases) API is known yet; My Stuff uses the bookmarks API
// outside sample mode. Titles in the comps' empty boxes are filled from the TVOD set so
// every card opens a real page.
import avatar from "../../assets/images/more-profile-avatar.webp";
import johnWick from "../../assets/images/my-stuff-poster-01-john-wick.webp";
import oneOfThemDays from "../../assets/images/my-stuff-poster-02-one-of-them-days.webp";
import cargo from "../../assets/images/my-stuff-poster-03-cargo.webp";
import theChi from "../../assets/images/my-stuff-poster-04-the-chi.webp";
import nightfall from "../../assets/images/my-stuff-poster-05-nightfall.webp";
import dune from "../../assets/images/my-stuff-poster-06-dune-part-two.webp";
import { tvodTitles, getTvodTitle } from "./tvodFixtures";
import michaelStill from "../../assets/images/tvod-movie-michael-trailer-still.webp";
import februaryBackdrop from "../../assets/images/tvod-featured-february-backdrop.webp";

export const moreProfile = { name: "Michael Scoffield", avatar, plan: "Wona Pro", planActive: true };

// My Stuff (comp More9): sample movies and shows. Sample-only titles have no details page.
const saved = (id, title, type, poster, addedDaysAgo, tvodId) => ({ id, title, type, poster, addedAt: Date.now() - addedDaysAgo * 864e5, tvodId });
const tvod = (id, addedDaysAgo) => {
  const t = getTvodTitle(id);
  return saved(`tvod-${id}`, t.title, t.type, t.poster, addedDaysAgo, id);
};
export const myStuffSample = [
  saved("john-wick", "John Wick", "movie", johnWick, 1),
  saved("one-of-them-days", "One of Them Days", "movie", oneOfThemDays, 2),
  saved("cargo", "Cargo", "movie", cargo, 3),
  tvod("michael", 6),
  tvod("us", 9),
  tvod("the-boys", 12),
  saved("the-chi", "The Chi", "series", theChi, 1),
  saved("nightfall", "Nightfall", "series", nightfall, 4),
  saved("dune-part-two", "Dune: Part Two", "series", dune, 5),
  tvod("empire", 7),
  tvod("wednesday", 10),
  tvod("bad-influencer", 14),
];
// Premieres the sample My Stuff starts with (comp shows "(05)")
export const myStuffSamplePremieres = ["project-hail-mary", "vis-a-vis", "the-rip", "the-cage", "mission-impossible"];

// My Library (comp More7): active rentals (landscape, expiry + progress), owned titles,
// expired rentals, and new TVOD releases.
const HOUR = 36e5;
export const libraryActiveRentals = [
  { id: "michael", title: "Michael", image: michaelStill, expiresAt: Date.now() + 32 * HOUR, progress: 85, left: "14 min left", rentedAt: Date.now() - 16 * HOUR },
  { id: "february", title: "February", image: februaryBackdrop, expiresAt: Date.now() + 32 * HOUR, progress: 62, left: "6 min left", rentedAt: Date.now() - 20 * HOUR },
];
export const libraryOwned = ["the-boys", "empire", "wednesday"].map((id, i) => ({ ...getTvodTitle(id), boughtAt: Date.now() - (i + 1) * 5 * 864e5 }));
export const libraryExpired = ["us", "bad-influencer", "the-boys"].map((id, i) => ({ ...getTvodTitle(id), progress: [25, 55, 90][i], expiredAt: Date.now() - (i + 2) * 864e5 }));
export const libraryNewReleases = tvodTitles;

export const expiresLabel = (at, now = Date.now()) => {
  const h = Math.max(0, Math.round((at - now) / HOUR));
  return h >= 48 ? `EXPIRES IN ${Math.round(h / 24)}D` : `EXPIRES IN ${h}H`;
};
