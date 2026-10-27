# Session 2026-07-17 → 2026-07-20 — auth port, subscriptions, content-API integration

> Session summary for future Claude/dev sessions. Distills the reusable PATTERNS discovered;
> narrative details live in [[log]] entries for these dates. Tags: see [[CLAUDE]].

## What shipped (headline)

Legacy auth ported (operators/OTP/login/refresh/logout + pages, revamp UI) · landing page ·
subscriptions (static packages, CRM purchase→redirect billing, history + `premiumSub`) ·
navbar redesigned to Figma 2659:955 (auth-aware, auto-hide) · content APIs wired per
brief-over-legacy (home rails, banners+title art, Keep Watching, Afrishorts, channels,
search V3, shorts player with real HLS vertical trailers) · dev bypass flags.

## Working agreements (user preferences) `✅ VERIFIED`

- **Brief over legacy**: where `raw/api-docs.md` and legacy disagree, the brief wins; legacy
  fills gaps (auth chain, packages-first, image URLs).
- **Legacy logic, revamp UI**: port behaviour 1:1 but rebuild visuals with this repo's design
  system (tokens, `fluid()` `--vw` scaling, `Button`/`classNames`). Never copy legacy SCSS.
- Legacy module names are preferred where a module maps 1:1 (`fetchMoviesApi.js`).
- Fix legacy bugs during ports, with a code comment noting the fix (inverted email regex,
  module-load cookie reads, interceptor stacking, cookie path mismatch).

## API facts discovered live (not in the docs) `✅ VERIFIED` on afriplaymtnghana

| Fact | Detail |
|---|---|
| Image ids → URL | `{CLIENT}/api/client/v1/global/images/{id}?accessKey=WkVjNWNscFhORDBLCg==` |
| `my_content` 400 | REQUIRES `?profile_id=` (localStorage `afri_profile_id`, default 1); fallback `users/{uid}/profiles/{pid}/bookmarks/movies` (MangoTV pattern) |
| `users/{id}/series` 400 | requires `?packages=` (movies listing too) |
| CRM settings nesting | `dashboard_categories` under `data.landing_page`; channel field is `dashboard_channel_category_id` (brief says `dashboard_category_id`) |
| vod/content rows | bare `{id, heading_image_id, content}` — names come from Categories **V2+V3** join |
| Channels list | no images; logos need per-channel `v1/channels/{id}` → `image_stores[0].id` |
| Banners | ids not URLs (`banner_image_id`/`preview_image_id`); title art via linked movie/series details (`title_art_image_id`) |
| `vertical_trailer` POST | body `{movies,series,episodes}` id arrays; path `{user_uid}` accepts subscriber uid; response nests `{status, data:{data:[{content_id,url,…}]}}`; URLs are **HLS .m3u8 → hls.js required** |
| Network check | CRM `/cm/api/auth` validates caller **IP** against operator ranges — fails off-network (wifi); MTN data required to test. Open Q: prod behaviour for wifi users |
| Login rate limit | 429 code 4290, `details.timeout` = lockout-end unix ts |

## Architecture patterns to keep following

- `api/client.js`: call-time token/operator reads (`clientContext()`), single global 401→refresh
  interceptor (main.jsx), per-load `packages` cache, `imageUrl()`. 20s timeouts.
- Slices hold API data; every page falls back to `src/data/*Fixtures.js` when a rail is empty —
  this powers **`VITE_USE_FIXTURES`** (design-review mode). `VITE_BYPASS_AUTH` skips route
  protection via `isAuthenticatedUser()`. Both build-time, in gitignored `.env.local`.
- Dashboard rails render **dynamically** from CRM order (`vodRails`), not hardcoded uids; top-10
  styling auto-applies when a category uid/name matches "top 10". No Top 10 rail in the brief.
- Afrishorts click → seed redux reels (poster = still + avatar) → navigate → resolve HLS URLs in
  background → `<video>`+hls.js with autoplay-across-swipes and duration-driven progress.
- Debug pattern that worked: dev-only `[api]` sample logs at each fetch step; user pastes console;
  map fields from reality, then strip. Public CRM endpoints can also be probed with curl directly.

## Process patterns

- **Push via gh CLI**: plain `git push` hangs (GCM prompt). Use
  `git -c credential.helper="!gh auth git-credential" push` (or run `gh auth setup-git` once).
- **Stale-branch hazard**: merging an out-of-date branch clobbered wiki files once (restored in
  `58a19d2`). Before merging a teammate branch: check merge-base, diff overlap, verify wiki after.
- Commit style: conventional prefixes, `Co-Authored-By: Claude`, wiki `log.md` line per work unit.
- Dev servers pile up on ports 5173+ — kill node processes before assuming which build you're viewing.

## Open items

- Monday session Qs: wifi/IP network-check prod behaviour; `dashboard_category_id` naming drift;
  subscription lineup (brief silent on packs; "Get Bundle" in new nav); vertical_trailer contract.
- Unwired from brief's homepage: channel-category injection slots, promo banner from
  `preview_image`s (AdBanner/GLOTV.svg currently in slot), halfway Genre section (`branded: true`),
  Live On TV Now via EPG. Maturity label needs age-ratings lookup.
- Logout lives in navbar avatar dropdown; legacy Drawer had it. `premiumSub` playback gating
  awaits the watch screen. Edward's Live TV + search screens still fixture-driven.
