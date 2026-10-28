// TVOD (WonaPremiere — rent or buy titles not in the user's plan). Sample data built
// from the WONA TVOD designs (assets/wonastuff, 2026-10-28). No TVOD API is known yet,
// so the whole flow runs on this data; prices/currency/providers are as designed (GH₵,
// Ghana MoMo networks) pending confirmation — see wiki open questions.
import bannerHeretic from "../../assets/images/home-mobile-tvod-banner-poster-01-heretic.webp";
import bannerFebruary from "../../assets/images/home-mobile-tvod-banner-poster-02-february.webp";
import bannerGhost from "../../assets/images/home-mobile-tvod-banner-poster-03-ghost.webp";
import heroBackdrop from "../../assets/images/tvod-hero-backdrop.webp";
import featuredBackdrop from "../../assets/images/tvod-featured-february-backdrop.webp";
import featuredTitleArt from "../../assets/images/tvod-featured-february-title-art.webp";
import posterMichael from "../../assets/images/tvod-poster-michael.webp";
import posterUs from "../../assets/images/tvod-poster-us.webp";
import posterTheBoys from "../../assets/images/tvod-poster-the-boys.webp";
import posterEmpire from "../../assets/images/tvod-poster-empire.webp";
import posterWednesday from "../../assets/images/tvod-poster-wednesday.webp";
import posterBadInfluencer from "../../assets/images/tvod-poster-bad-influencer.webp";
import michaelTrailerStill from "../../assets/images/tvod-movie-michael-trailer-still.webp";
import castJaafar from "../../assets/images/tvod-movie-cast-jaafar-jackson.webp";
import castNia from "../../assets/images/tvod-movie-cast-nia-long.webp";
import castColman from "../../assets/images/tvod-movie-cast-colman-domingo.webp";
import more01 from "../../assets/images/tvod-movie-more-like-this-01-esin-baba.webp";
import more02 from "../../assets/images/tvod-movie-more-like-this-02-citation.webp";
import more03 from "../../assets/images/tvod-movie-more-like-this-03-love-in-every-word.webp";
import more04 from "../../assets/images/tvod-movie-more-like-this-04-project-hail-mary.webp";
import more05 from "../../assets/images/tvod-movie-more-like-this-05-180.webp";
import more06 from "../../assets/images/tvod-movie-more-like-this-06-conclusion.webp";
import more07 from "../../assets/images/tvod-movie-more-like-this-07-mission-impossible.webp";
import more08 from "../../assets/images/tvod-movie-more-like-this-08-sweet-home.webp";
import more09 from "../../assets/images/tvod-movie-more-like-this-09-michael.webp";
import mtnLogo from "../../assets/logos/payment-momo-provider-mtn-logo.webp";
import ghanaFlag from "../../assets/icons/payment-country-flag-ghana.webp";

export const CURRENCY = "GH₵";
export const formatPrice = (amount, decimals = false) => `${CURRENCY}${decimals ? amount.toFixed(2) : amount}`;

// Home banner (mobile, between Live on TV Now and Top 10) — design "btwnliveontv_and_top10movies"
export const tvodBanner = {
  posters: [bannerHeretic, bannerFebruary, bannerGhost],
  title: "New releases to rent or buy",
  subtitle: `Titles not in your plan. From ${formatPrice(20)}.`,
};

export const tvodHero = { backdrop: heroBackdrop };

// Access options shown in the "Choose your access" sheet. The design's sheet shows
// GH₵55 for Buy while the title page says "Buy for GH₵250"; Buy uses the title's own
// buy price so the two always agree.
const accessOptions = (title) => [
  { id: "standard", label: "Standard", detail: "48 hrs to watch · SD + HD", hours: 48, quality: "SD + HD", price: title.rentPrice },
  { id: "extended", label: "Extended", detail: "72 hrs to watch · Full HD", hours: 72, quality: "Full HD 1080p", price: title.extendedPrice, popular: true },
  { id: "buy", label: "Buy — Own Forever", detail: "Unlimited · 4K + Dolby Atmos", hours: null, quality: "4K + Dolby Atmos", price: title.buyPrice },
];

const michael = {
  id: "michael",
  type: "movie",
  title: "Michael",
  year: 2026,
  runtime: "2h 07m",
  genres: ["Docudrama", "History", "Music"],
  badges: ["4K", "HDR10+", "PG-13"],
  poster: posterMichael,
  trailerStill: michaelTrailerStill,
  rentPrice: 20,
  extendedPrice: 28,
  buyPrice: 250,
  synopsis:
    "The early life of musician Michael Jackson, from the discovery of his talent as the lead of the Jackson Five to the artist whose creative ambition fueled a pursuit to become the biggest entertainer in the world.",
  credits: [
    { label: "Director", value: "Antoine Fuqua" },
    { label: "Studio", value: "Golden Effects" },
    { label: "Released", value: "Jun 20, 2026" },
  ],
  cast: [
    { name: "Jaafar Jackson", role: "Michael", photo: castJaafar },
    { name: "Nia Long", role: "Katherine Jackson", photo: castNia },
    { name: "Colman Domingo", role: "Joseph Jackson", photo: castColman },
  ],
  moreLikeThis: [more01, more02, more03, more04, more05, more06, more07, more08, more09],
};

// Other titles reuse Michael's detail page content (only Michael is designed in full).
const title = (id, name, type, year, genre, poster, extra = {}) => ({
  ...michael,
  id,
  title: name,
  type,
  year,
  genres: [genre],
  poster,
  ...extra,
});

export const tvodTitles = [
  michael,
  title("us", "Us", "movie", 2023, "Horror", posterUs),
  title("the-boys", "The Boys", "movie", 2024, "Action", posterTheBoys),
  title("february", "February", "movie", 2026, "Drama", featuredBackdrop, { genres: ["Teen", "Mystery", "Drama"] }),
  title("empire", "Empire", "series", 2023, "Drama", posterEmpire),
  title("wednesday", "Wednesday", "series", 2024, "Horror", posterWednesday),
  title("bad-influencer", "Bad Influencer", "series", 2023, "Drama", posterBadInfluencer),
];

export const tvodFeatured = {
  id: "february",
  backdrop: featuredBackdrop,
  titleArt: featuredTitleArt,
  genres: ["Teen", "Mystery", "Drama"],
  buyPrice: 250,
  rentPrice: 20,
};

export const getTvodTitle = (id) => tvodTitles.find((t) => t.id === id) || null;
export const getAccessOptions = (t) => (t ? accessOptions(t) : []);

// Mobile Money providers (as designed: Ghana networks)
export const momoProviders = [
  { id: "mtn", name: "MTN Mobile Money", short: "MTN MoMo", logo: mtnLogo },
  { id: "vodafone", name: "Vodafone Cash", short: "Vodafone Cash", logo: null },
  { id: "airteltigo", name: "AirtelTigo Money", short: "AirtelTigo Money", logo: null },
];
export const momoCountry = { dialCode: "+233", flag: ghanaFlag };

// Preview-mode payment outcomes (no payment API yet):
//  card ending 0002 → declined; anything else → confirmed
//  MoMo number ending 0000 → not approved; ending 1111 → insufficient balance; else → confirmed
export const PREVIEW_DECLINED_CARD_SUFFIX = "0002";
export const PREVIEW_MOMO_NOT_APPROVED_SUFFIX = "0000";
export const PREVIEW_MOMO_INSUFFICIENT_SUFFIX = "1111";
