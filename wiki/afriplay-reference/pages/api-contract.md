# API Contract

> Distilled from [[api-docs]] (principal-dev email, ingested 2026-06-08). Tags: see [[CLAUDE]].
> Source of truth = `raw/api-docs.md` (immutable); this page is the working interpretation.
> Status: `🔗 EXTERNAL` — endpoints are documented but **not yet integrated/verified in this codebase**. A clarification session is scheduled **Monday 2026-06-08**. Open items still tracked in [[open-questions]].
> The OpenAPI/ReDoc spec lives behind VPN at `https://172.20.1.10:11401/docs/api/client/` — verify shapes there (and against MangoTV's verified `api.md`, same Uniqcast Client API) before coding.

The platform reuses the **Uniqcast Client API** + **TVAnywhere CRM** that MangoTV runs on, so MangoTV's verified endpoint shapes (`mangotv/wiki/api.md`) apply where the same path appears. AfriPlay differences are operator config + the new Afrishorts/Reels surface.

## Operators `🔗 EXTERNAL`

AfriPlay has **two operators** — maintain both in the current onboarding flow.

| Operator | `operator_uid` (ouid) | `operator_id` | username prefix |
|----------|----------------------|---------------|-----------------|
| AfriPlay **MTN Ghana** | `afriplaymtnghana` | 237 | `amngh` |
| AfriPlay **Ghana** (Other Networks) | `afriplayghana` | 235 | `afpgh` |

`{ouid}` in every Client API path below = the `operator_uid`.

## Base URLs `🔗 EXTERNAL`

| Layer | Base URL | Purpose |
|-------|----------|---------|
| **Client API** | `https://ott.tvanywhereafrica.com:28182` | Login, content, streaming, channels (Uniqcast) |
| **CRM API** | `https://tvanywhereonline.com/cm` | Client settings, notifications/inbox, subscriber mgmt |

Mirrors MangoTV's dual-API design (CRM for config/subscriber, Client for content). See MangoTV `api.md` for axios instances, token-refresh interceptor, and dev-proxy pattern — reuse the same approach.

## CRM Client Settings `🔗 EXTERNAL`

`GET https://tvanywhereonline.com/cm/api/client/?operator_uid={operator_uid}&mode=web`

Drives homepage composition. Key fields:
- `dashboard_categories` — ordered list of **VOD category IDs** to render on the homepage.
- `dashboard_category_id` — the **first** channel category ID to inject (after the first VOD category).

### CRM has TWO profiles — `mode=web` vs `mode=app` `✅ VERIFIED` 2026-07-30
`GET /cm/api/client/?operator_uid={ouid}&mode=…` returns a **structurally different** payload per
mode. The brief tells us to use `mode=web`; the principal dev's mobile app uses `mode=app`. This is
why the two homepages show different rails — **CRM configuration, not a code difference.**

| | `mode=web` (ours) | `mode=app` (mobile) |
|---|---|---|
| rail ids | `landing_page.dashboard_categories` — **10** | `dashboardrails` — **13** |
| | `[7435,7086,7077,7084,7081,7439,7080,7078,7076,7075]` | `[7527,7435,7086,7077,7570,7084,7567,7081,7439,7080,7078,7076,7075]` |
| channel category | `dashboard_channel_category_id: 7318` | `channelrail_category_id: 7318` + `channelrail_position: "top1"` |
| extra keys | — | `dashboardbottomrails:[7567]`, `adbanners:[]`, `adbannerposition:100`, `secondbanner`, `featured_channels:7073` |

- **The 3 ids the app has and web doesn't: `7527`, `7570`, `7567`** — these are the "Recommended" /
  "Nolly Special" rails visible on mobile but absent on web. To match, the client must add them to
  the **web** profile's `dashboard_categories` (or we'd have to read the app profile, which
  contradicts the brief).
- **`secondbanner`** is the promo banner's section heading, localized:
  `{"ar":"مُستَحسَن","en":"Recommended","pt":"Recomendado"}` — this is where the mobile app's
  "Recommended" label above the banner comes from. ⚠️ **Absent from the web profile**, so the code
  falls back to the literal "Recommended" until the client adds it.
- `mode=app`/`mode=mobile` both return `status: ok` but with none of the web keys — don't assume a
  missing field means the endpoint failed.

---

## Homepage composition `🔗 EXTERNAL`

The homepage is assembled from several sources in a specific order. Render order (per brief):

1. **Banners** (top carousel)
2. First **VOD category** (from `dashboard_categories[0]`)
3. **First channel category** (injected — id from `dashboard_category_id`)
4. **Promotional banner** (large, Champions-League-style)
5. Genre section ~halfway through the VOD list
6. …remaining VOD categories…
7. **Second channel category** (injected — immediately *before the last* VOD category)
8. Last VOD category

### Banners — `GET /v1/{ouid}/users/{user_id}/banners`
- Fetched like Mango+. Use **title-art images** for banners that link to a movie/series (where available).
- **Promotional banner** image = a **random** pick from the `preview_image` values of available banners.
- Shape: see MangoTV `api.md` "User Banners" (`banner_image_id`, `preview_image_id`, `type`, `link`, `content_id`, etc.). → feeds [[home]] hero.
- ⚠️ **Do NOT add `device_class`** — `✅ VERIFIED` 2026-07-30: MangoTV's `api.md` marks it *REQUIRED*,
  but on this operator `?device_class=desktop` and `=mobile` both return **`data: []`**, while omitting it
  returns the banner. On the row `device_class` is an **array** (`["DESKTOP","MOBILE","STB","TABLET","TV"]`),
  so the query param evidently isn't the scalar match MangoTV's doc implies. `api/fetchMoviesApi.js`
  correctly omits it — 🪦 treat the MangoTV "REQUIRED" note as `STALE` for AfriPlay.
- `✅ VERIFIED` 2026-07-30: this operator currently publishes **one** banner
  (`id:698 uid:"drifted" size:"INTERMEDIATE" type:"VOD" vod_type:"MOVIE" content_id:15346 position:15`),
  so the hero carousel has a single slide and the "random `preview_image`" promo banner has one choice.
  `size` enum observed as `INTERMEDIATE` (MangoTV documents `SMALL|MEDIUM|LARGE`) — don't filter on `size`
  against those literals. Non-user `GET /v1/{ouid}/banners` returns the same single row.

### Hero title art — `title_art_image_id` `✅ VERIFIED` 2026-07-30 (live probe)
- **The field exists only on VOD category-content rows** (`v1/{ouid}/categories/vod/content` →
  `rows[].content[].title_art_image_id`). It is **NOT** on the movie/series *detail* records, and
  `movie_image_stores` comes back `[]` — so enriching a banner from `users/{id}/movies/{id}` and
  reading `d.title_art_image_id` (as the hero mapping did) could never find one. Fixed: the hero now
  builds a `contentId → title_art_image_id` map from the content rows it already fetches, keeping the
  detail-record fields as fallbacks.
- ⚠️ **This operator has uploaded no title art at all** — `title_art_image_id` is `null` for **all 75**
  items across all 10 dashboard categories, so the hero legitimately falls back to its text title
  (`text-5xl` = 28px fluid, much smaller than the 375×136 art slot). Not a code bug; a CRM content gap.
  A DEV log now reports the populated count so this is visible.
- 🪦 Do **not** mistake the poster for title art: posters often have the title baked in as artwork
  (e.g. Drifted's poster `331623` carries a cursive "Drifted"), which is what the production mobile
  app shows. There is no separate transparent wordmark asset — `banner_image_id` and
  `preview_image_id` are plain key art with no text (verified by fetching them: 864×408 and 1920×1080
  JPEGs, no alpha).
- No image-store endpoints exist: `movies/{id}/image_stores`, `image_stores?movie_id=`, and
  `movies/{id}/images` all **404**. Param variants (`translation`, `image_stores`, `with_images`,
  `full`) change nothing.
- ⚠️ Banner image ids are not stable — `banner_image_id` for banner 698 was `331665` early on
  2026-07-30 and `333101` later the same day. Don't hardcode or cache them.

### Afrishorts rail (homepage rounded horizontal list) — `🔗 EXTERNAL`
> ⚠️ **Label change:** Figma says "Afriplay Shorts" → render as **"Afrishorts"** in the app. Log/flag in [[home]] + [[shorts-reels]].

Rounded horizontal list of shorts-eligible content:
- **Movies** with a value in `vertical_trailer` **or** `vertical_trailer_url_ott`.
  `GET /v1/{ouid}/users/{user_id}/movies`
- **Series** with `has_vertical_trailer === true`.
  `GET /v1/{ouid}/users/{user_id}/series` and/or `GET /v1/{ouid}/series`
- Group the resulting **movie IDs / series IDs / episode IDs** and POST them to the Vertical Trailer API (below) to get all playback URLs for the Afrishorts screen.

### Vertical Trailer API — `POST /v1/{ouid}/users/{user_uid}/vertical_trailer`
- Batch endpoint: send grouped movie/series/episode IDs → returns the vertical-trailer video URLs.
- Powers both the homepage Afrishorts rail and the Shorts/Reels player. → [[shorts-reels]].

### Keep Watching (Continue Watching) — `GET /v1/{ouid}/users/{user_id}/my_content`
- Same behaviour as Mango+ "Continue Watching". → [[home]] continue rail.

### VOD category listings — `GET /v1/{ouid}/categories/vod/content`
- Category IDs come from CRM `dashboard_categories`. Content + details fetched here (same as Mango+ — params `packages`+`categories` required; see MangoTV `api.md`).

### Channel category injection — `GET /v1/{ouid}/categories/channels`
- **First** channel category: id from CRM `dashboard_category_id`; placed right after the first VOD category.
- **Second** channel category: the channel category whose UID is **`featured`** (from this same Channel Categories API); placed right before the last VOD category.

### Genre section — `GET /v1/{ouid}/categories/vod/content`
- Appears ~halfway through the VOD listings (e.g. 7 categories → after the 3rd).
- Behaves like Mango+ "Brands": horizontal list of VOD categories where `branded === true`.

---

## Shorts / Reels page `🔗 EXTERNAL` → [[shorts-reels]]

### Afrishorts categories — `GET /v3/{ouid}/categories/rail`
- Rail categories e.g. "For You", "Trending", "Sports".
- `✅ VERIFIED` 2026-07-21: both rail endpoints **400 without `?packages=`** (code 1034,
  "Must send packages in querystring") — same requirement as the movies/series/channels listings.
- `✅ VERIFIED` live-probed 2026-07-30 — returns exactly the design's 3 chips:

  | name | id | uid | `heading_image_id` | image served |
  |---|---|---|---|---|
  | For You | 7509 | `contentCover` | 332952 | 1248×699 png (**16:9**) |
  | Trending | 7511 | `exclusiveVod` | 332953 | 816×816 png (1:1) |
  | Sports | 7510 | `topVod` | 332954 | 480×320 jpeg (3:2) |

  Row keys: `id, uid, name, desc, parent_id, subcategories, movies_count, series_count,`
  `heading_image_id, branded, background_color, background_image_id, logo_image_id, is_default, top_list`.

### Shorts-page banner (the "LIVE hero" card) — `heading_image_id` `✅ VERIFIED` 2026-07-30
> **Brief is silent on this element** — resolved by live probe, not by the brief. `❓ NEEDS-CLARIFICATION`
> only on the *badge/caption* text (see below).

- **Source: the selected rail category's `heading_image_id`**, rendered through the image CDN
  (`imageUrl(heading_image_id)`). Available two ways — same value from both:
  - `GET /v3/{ouid}/categories/rail?packages=` → every category's `heading_image_id` up front.
  - `GET /v1/{ouid}/categories/rail/content?packages=&categories={id}` → rows are
    `{id, heading_image_id, content:[…]}`, so the selected rail's heading image arrives with its content.
- Confirmed operator-authored promo artwork, not a poster: 332952 is a 16:9 CNN-branded studio
  banner — and the category uid is literally **`contentCover`**. Matches the design's `aspect-[16/9]`
  hero. ⚠️ Trending/Sports heading images are square/3:2 (CRM upload inconsistency) → must render
  `object-cover`, never letterboxed.
- **NOT the Banners API.** `users/{user_id}/banners` returns exactly **one** row for this operator —
  `{id:698, uid:"drifted", size:"INTERMEDIATE", type:"VOD", content_id:15346}` — a homepage VOD promo
  with no shorts relationship. Ruled out by probe.
- The card's **"LIVE" badge, `@AfriSportsHQ` handle and "1.5M views"** have **no API source** (and the
  brief says view counts are ignored). **Resolved 2026-07-30 by suppressing them in API mode** rather
  than inventing them — the production app shows this card clean too. Fixture/design mode still renders
  the full designed overlay. Residual product question in [[open-questions]] #23.
- ✅ **Wired 2026-07-30** — `api/shorts.js` → `shortsSlice.liveReelPreview` → both `ShortsPage`
  (`LiveReelBanner`, `showLive={!apiMode}`) and `MobileShortsPage`. Tapping it seeds the reel queue via
  `openAfrishortsPlayer` and enters the player at the top of the rail.

### Shorts-page "Trending Now" — rail items `✅ VERIFIED` 2026-07-30
> **Brief is silent on this section too** (it documents only the rounded rail and the grid).

- **Source: rail category content items**, mapped exactly like the grid (`toShortCard`), ranked by
  their position in the API array. `✅ VERIFIED` against the production app, whose row is
  *Monica's error → My Wife's Lover → Boomerang → Blade Trinity* — item-for-item the order
  `categories/rail/content` returns.
- `⚠️ ASSUMPTION` **which** rail feeds it. This operator returns **identical content for For You
  (7509) and Trending (7511)** — all 20 items, same order — so live data cannot distinguish "the
  Trending rail" from "the selected rail"; the production screenshot matches both. Implemented as the
  **dedicated Trending rail** (matched on name/uid `/trend/i`, falling back to the selected rail) so the
  section keeps its label's meaning and doesn't just mirror the grid beneath it. Revisit if the operator
  ever differentiates the rails.
- Ranks are **derived from array order** — every item's own `position` is `0`. The category's
  `top_list` boolean (`true` only for Sports here) is the API's actual "this is a ranked rail" signal if
  that ever needs honouring.
- View counts stay blank per the brief, so the tiles' `views` labels are conditional (they rendered as a
  bare `" views"` / empty pill before 2026-07-30).

### Rail category content — `GET /v1/{ouid}/categories/rail/content`
- **Top rounded list:** first **10–15** movies/series of the selected rail.
- **Grid view:** larger set (**20+**) movies/series of the selected rail.
- `✅ VERIFIED` 2026-07-30: `data` is one row **per requested category** —
  `{id, heading_image_id, content:[…]}`; category 7509 returned 20 items. Item keys:
  `id, uid, type, title, image_id, preview_image_id` (+ `title_art_image_id`, `year`, `critics_rating`).
  `preview_image_id` is frequently **null** — fall back to `image_id`.

### Behaviour
- View counts and like counts → **ignore** (don't display).
- Selecting an item → navigate to **Shorts page**: play that item's vertical trailer (via Vertical Trailer API), then continue through other vertical trailers in the same category.
- **Watch button / profile "+"** → Movie Details (movies) or Series Details (series).
- **Profile icon** on Shorts page = the movie/series **poster image**.
- **Controls:** Like and My List are redundant — replace **one** of them with a **Volume/Mute** button. `❓` which one → [[open-questions]].

---

## Live TV `🔗 EXTERNAL` → [[live-tv-epg]], [[live-tv-filters]]

| Data | Endpoint |
|------|----------|
| Channels | `GET /v2/{ouid}/channels` (Channels-V2) |
| Channel categories | `GET /v1/{ouid}/categories/channels` |
| Playout links | `GET /v1/{ouid}/users/{user_id}/live/channels/{channel_uid}` |
| EPG grid | `GET /v2/{ouid}/shows/grid` |
| EPG grid (lite) | `GET /v2/{ouid}/shows/grid/lite` |
| Show replay | `GET /v1/{ouid}/users/{user_id}/live/channels/{channel_uid}/shows/{show_id}/offset/{offset}` |

> ⚠️ Playout uses **`channel_uid` (string)**, not numeric ID — same gotcha flagged in MangoTV `api.md`.
> `✅ VERIFIED` live 2026-07-21: category→channel mapping lives on the **category** side — each
> `categories/channels` row carries `channels: [{id, packages}]`; channel rows/details have **no**
> category field. A channel can belong to several categories (e.g. `featured` + Sports). Channels-V2
> rows DO carry `name`, `position`, `logos`, `epg_channel` directly.

---

## Movies section `🔗 EXTERNAL`

Displays all movies, series, and their categories.

| Data | Endpoint |
|------|----------|
| VOD categories | `GET /v2/{ouid}/categories/vod` (Categories-V2) |
| Category content details | `GET /v1/{ouid}/categories/vod/content` |
| Movie details | `GET /v1/{ouid}/users/{user_id}/movies` |
| Series | `GET /v1/{ouid}/series` |

---

## Inbox (notifications from CRM) `🔗 EXTERNAL`

CRM Postman collection (`getpostman.com/view/14902197/VUjSEiNQ`):
- **Fetch** notifications — `#c55b9d23-d4f9-46ca-a954-200e6c32dd4c`
- **Read** (mark read) — `#0cc31090-c52d-4940-ada1-d404e714e698`
- **Delete** — `#2a0ab303-1537-465b-96e1-8db6ccaec0b4`

---

## Search `🔗 EXTERNAL` → [[search]], [[search-results]]

- Unchanged from Mango+: `GET /v3/{ouid}/search/global/{keyword}` (Search-V3).
- Empty/landing state: show a **random selection** of movies/series as recommended / "Top 5" content.
- **Recent Searches:** cache the user's searches client-side and show them back. (Resolves [[open-questions]] #5 — recent searches are **client-cached**, not server-side.)

---

## Auth / tokens

Reuses Uniqcast login + token-refresh (same as MangoTV). Onboarding keys on the operator `username_prefix` (`amngh` / `afpgh`). Detailed flow → confirm at Monday session / MangoTV `api.md` "Auth Endpoints".

## Scope note

> "All other screens and functionality not covered by the new designs should remain unchanged and continue to use the existing implementation until updated designs are provided." — keep existing behaviour for anything not listed above.

## Integration map — revamp `src/api/*` (added 2026-07-17)

> Precedence rule (per the user): **the API brief (raw/api-docs) wins over legacy** wherever they differ. Legacy (`afriplay-ghana-main`) is used only to fill gaps the brief doesn't cover (auth chain, packages-first pattern).

| Surface | Endpoint(s) | Source | File |
|---|---|---|---|
| Packages chain | `v1/{ouid}/users/{user_id}/packages?device_class=desktop` → id csv | legacy (brief silent; confirmed pattern) `🔶 LIKELY` | `api/client.js` |
| Home VOD rails | CRM settings `dashboard_categories` → `v1/{ouid}/categories/vod/content?packages&categories` | **brief** (legacy fetched ALL categories, bucketed client-side) | `api/fetchMoviesApi.js` |
| Banners/hero | `v1/{ouid}/users/{user_id}/banners` | **brief** (legacy: non-user `/banners` + hardcoded accessKey — do not use) | `api/fetchMoviesApi.js` |
| Keep Watching | `v1/{ouid}/users/{user_id}/my_content` | brief = legacy ✅ | `api/fetchMoviesApi.js` |
| Channel category injection | `v1/{ouid}/categories/channels`; 1st = CRM `dashboard_category_id`, 2nd = uid `featured` | **brief** (new) | `api/fetchMoviesApi.js` |
| Channels / EPG | `v2/{ouid}/channels?packages`, `v2/{ouid}/shows/grid[,/lite]`, playout `users/{uid}/live/channels/{chuid}`, replay `.../shows/{show_id}/offset/{offset}` | brief ⊇ legacy | `api/liveTv.js` → `liveTvSlice` → LiveTvPage (wired 2026-07-21; `⚠ ASSUMPTION` EPG show shapes — `toMs`/field-name mapping is defensive, verify with dev `[api]` logs on-network) |
| Search | `v3/{ouid}/search/global/{keyword}` + local Recent Searches cache (`afri_recent_searches`) | **brief** (legacy v1 movies-only `translation=hr` — do not use) | `api/search.js` |
| Afrishorts | `v3/{ouid}/categories/rail`, `v1/{ouid}/categories/rail/content`, `POST users/{uid}/vertical_trailer` (grouped ids) | **brief** (no legacy counterpart) | `api/shorts.js` |
| Hero trailer | `v1/{ouid}/users/{uid}/vod/trailers/movies/{id}` (series → `.../episodes/{id}`) → `data.url` | legacy `🔶 LIKELY` (brief silent; legacy DynamicBanner pattern — legacy always used movies path on home, fixed) | `api/fetchMoviesApi.js` `fetchTrailer` → HeroSection background |
| Landing teasers | CRM `/cm/api/client/?operator_uid&mode=web` → `landing_page.categories/banners` | legacy `🔶 LIKELY` (works signed-out; legacy hardcoded `afriplaymtnghana` — use selected/default operator) | TODO wire into LandingPage |

`⚠ ASSUMPTION` all response-shape mappings in `api/fetchMoviesApi.js` (`toCard`, rail uids like `afriplaytop10`) are defensive guesses — spec is behind VPN; every rail falls back to fixtures when empty. Verify shapes against `https://172.20.1.10:11401/docs/api/client/` or MangoTV's `api.md`.

Dev flags (`.env.local`): `VITE_BYPASS_AUTH` (skip route protection), `VITE_USE_FIXTURES` (content thunks no-op → pages render the as-designed fixture assets). See [[open-questions]] for the wifi/IP network-check question.
