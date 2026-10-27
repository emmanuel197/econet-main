import axios from "axios";
import { CM_BASE } from "./authApis";
import { imageUrl } from "./client";
import { USE_FIXTURES } from "../utils/devFlags";
import { getSelectedOperator } from "../utils/authConstants";

// Public landing content (signed-out "/") — legacy fetchTrendingAndRecentlyAddedMovies /
// fetchLandingBanners pattern: the CRM client-settings endpoint needs NO auth and carries
// banners + rails inline under data.landing_page (verified live 2026-07-20: 10 banners,
// trending 20 / recentlyadded 20 / Bingeworthy 13 — note the uid casing drift).
// Legacy hardcoded afriplaymtnghana; we prefer the selected operator when one exists.

const landingOperatorUid = () =>
  getSelectedOperator()?.operator_uid ||
  import.meta.env.VITE_DEFAULT_OPERATOR ||
  "econetzw";

const toCard = (item) => ({
  id: item.id ?? item.uid,
  image: imageUrl(item.image_id) || "",
  title: item.title || "",
  metadata: [item.year].filter(Boolean).join(" · "),
  contentType: item.type,
  raw: item,
});

const railByUid = (categories, uid) => {
  const lower = uid.toLowerCase();
  const cat = (categories || []).find((c) => (c.uid || "").toLowerCase() === lower);
  return (cat?.content || []).map(toCard);
};

// Returns { hero, trending, recentlyAdded, bingeWorthy } or null (fixtures render).
export const fetchLandingContent = async () => {
  if (USE_FIXTURES) return null;
  try {
    const res = await axios.get(`${CM_BASE}/api/client/`, {
      params: { operator_uid: landingOperatorUid(), mode: "web" },
      timeout: 20000,
    });
    if (res.data?.status !== "ok") return null;
    const landing = res.data.data?.landing_page ?? {};

    const hero = (landing.banners || [])
      .filter((b) => b.visible !== false)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((b) => ({
        id: b.id,
        backdrop: imageUrl(b.banner_image_id) || "",
        previewImage: imageUrl(b.preview_image_id) || null,
        titleArt: null, // banners carry no title art — HeroSection falls back to the text title
        title: b.title || "",
        description: b.description || "",
        contentId: b.content_id ?? b.series_content_id ?? null,
        raw: b,
      }))
      .filter((b) => b.backdrop);

    return {
      hero,
      trending: railByUid(landing.categories, "trending"),
      recentlyAdded: railByUid(landing.categories, "recentlyadded"),
      bingeWorthy: railByUid(landing.categories, "bingeworthy"),
    };
  } catch (e) {
    if (import.meta.env.DEV) console.log("[api] fetchLandingContent failed — fixtures render", e.message);
    return null;
  }
};
