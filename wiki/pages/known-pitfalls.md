# Known pitfalls (carried over from AfriPlay)

> Problems AfriPlay Ghana hit on the same Uniqcast Client API + TVAnywhere CRM, with the fix.
> Source: afriplay-ghana-revamp wiki (`pages/api-contract.md`, `sessions/2026-07-17-*.md`, `log.md`
> 2026-07-17…07-30) and its `src/api/*`. All verified on `afriplaymtnghana`, so `🔶 LIKELY` for
> `econetzw` until re-checked. When one is confirmed or disproved for WONA, re-tag it here.

## API requests

| Problem | Fix |
|---|---|
| Client API calls 400 (code 1034) | Most listing calls need `?packages=`: `users/{id}/series`, movies listing, `v2/channels`, `v3/categories/rail`, `v1/categories/rail/content`, `vod/{seg}/{id}/related`. Build it once per load from `GET v1/{ouid}/users/{uid}/packages?device_class=desktop` → `data.map(p => p.id).join(",")`. |
| `my_content` 400 | Needs `?profile_id=` (default 1). Data in `data.movie_bookmarks` / `data.episode_bookmarks`. Fallback `v1/{ouid}/users/{uid}/profiles/{pid}/bookmarks/movies`. |
| Bookmarks "saved" but Keep Watching empty | PUT body `name` must be a **string**; every bookmark PUT/GET/DELETE needs `?profile={pid}` (same id as `my_content`). Movie PUT: `v1/{ouid}/users/{uid}/bookmarks/movies/{id}/{id}?profile=` (id twice), body `{ time: <ms>, name: String(id) }`. Episode: `.../bookmarks/episodes/{id}?profile=`. |
| Banners return `data: []` | Do **not** send `device_class` to `v1/{ouid}/users/{uid}/banners`. Don't filter on `size` (real value `INTERMEDIATE`). |
| Channel logos missing | `v2/channels` has no images; per-channel `v1/{ouid}/channels/{id}` → `image_stores[0].id`. |
| Live playout fails | Uses `channel_uid` (string), not numeric id: `v1/{ouid}/users/{uid}/live/channels/{channel_uid}`. |
| Category → channel mapping | Lives on `v1/{ouid}/categories/channels` rows (`channels:[{id,packages}]`); channel rows have no category. |
| Signed-out content calls 403 | Client API is auth-only; the image accessKey doesn't unlock it. Signed-out/landing content comes from the public CRM settings call. |
| Image-store endpoints | `movies/{id}/image_stores`, `image_stores?movie_id=`, `movies/{id}/images` all 404 — don't use. |

Base: `${CLIENT}/api/client/${path}`, header `Authorization: Bearer <access_token>`, 20s timeout.
Search: `v3/{ouid}/search/global/{encodeURIComponent(keyword)}`, strip `/[^\w\s]/gi` first.
Episodes batch: `GET v1/{ouid}/episodes?episodes_id=1,2,3`. EPG: `v2/{ouid}/shows/grid[/lite]?channels=&start_date=&end_date=` (ISO).

## Response shapes

- Envelope `{status:"ok", data}`; errors `{code, status:"error", data:{message, timeout?}}`.
- CRM settings: rails at `data.landing_page.dashboard_categories`; channel id is `dashboard_channel_category_id` (brief said `dashboard_category_id`) — accept both, at both levels.
- `categories/vod/content?packages&categories=` rows are bare `{id, heading_image_id, content}` — names/uids come from joining `v2/{ouid}/categories/vod` + `v3/{ouid}/categories/vod` by id (some ids are only in one).
- Rail items: `id, uid, type, title, image_id, preview_image_id, title_art_image_id, year, critics_rating`; `preview_image_id` often null → fall back to `image_id`; `position` is always 0 → keep array order; `top_list` = ranked rail.
- `vertical_trailer` POST (`v1/{ouid}/users/{user_uid}/vertical_trailer`, body `{movies,series,episodes}`) is double-nested: read `res.data.data`.
- Trailers: `v1/{ouid}/users/{uid}/vod/trailers/{movies|episodes}/{id}` → `data.url`; series use `episodes` (legacy wrongly used `movies`).
- Playout: `vod/movies/{id}`, `vod/episodes/{id}`, `live/channels/{channel_uid}` → `data.url` (HLS).
- Movie details have `image_store_id`; image fallback `image_id → image_store_id → image_stores[0].id`.
- `duration` = runtime in **minutes**, absent from rail rows (join from `users/{uid}/movies|series`). Bookmark `time` is ms; bookmark durations come in s or min by endpoint.
- Time formatting: round total seconds first, then split (avoids "0:60").
- CRM inbox may return an object instead of an array → coerce `Array.isArray(x) ? x : []` before `.filter` (it white-screened every page via the navbar badge).

## Auth

Flow: select network → CRM network check → OTP generate → OTP validate → signup (new users) → login.

| Step | Call |
|---|---|
| Network check | `GET {CM}/api/auth/?operator_uid={ouid}&usr={prefix+msisdn}` with headers `Username` / `Password` (values from env, never committed) → `{valid}` |
| OTP generate | `POST {CM}/api/otp/?operator_uid={ouid}&mode=generate` body `{mobile_number}` |
| OTP validate | `POST {CM}/api/otp/?operator_uid={ouid}&mode=validate` body `{mobile_number, otp}` (6 digits) |
| Signup | `POST {CM}/api/subscriber/?operator_uid={ouid}` body `{first_name,last_name,email,phone_number,password,username}`; message "subscriber already exist" → go to login |
| Login | `POST {CLIENT}/api/client/v2/global/login` body `{login_type:"Credentials", username:"{prefix}{msisdn}@{ouid}", password, device, device_class, device_type, device_os}` |
| Refresh | `POST {CLIENT}/api/client/{v1\|v2}/global/refresh` body `{refresh_token}` — same version that issued the tokens |
| Logout | `POST {CLIENT}/api/client/v1/global/logout` (Bearer) |

- Login: use V2 first. Fall back to V1 (`/v1/global/login`, no `login_type`) **only** on network error/5xx/404 — a V2 4xx is the real answer. V2 gives rate-lock as 429 code 4290 with `data.timeout` (unix lockout end); V1 hides it as 3010.
- `device` (uuid cookie) is required (V1 3011 without it) — create it before login.
- AfriPlay is passwordless: one constant default password, CRM password reset to it before login (`PUT {CM}/api/subscriber/?operator_uid&subscriber_uid=` body `{password}`). ❓ Confirm WONA wants the same model.
- One global 401 interceptor registered at boot; skip `/global/(refresh|login)/`; dedupe concurrent refreshes with one in-flight promise; on refresh failure clear the session (else 401 → refresh → 401 loop).
- Read tokens/operator at **call time**, never at module load (stale values).
- All cookies with `path:"/"` (set and remove).
- A stale stored operator signs in with the wrong prefix and Uniqcast just says 3010 — store an explicit network choice marker. (WONA has one operator, so likely moot.)
- Auth redirects use `navigate(..., { replace: true })` or Back loops forever. Honour `redirectTo` (same-origin path only, not an auth page).
- A 200 with `status !== "ok"` is a failure — handle it or buttons stay stuck "Verifying…".

## Network check

- CRM `/api/auth` validates the caller's **IP** against the operator's ranges; off-network (wifi) → `valid:false`. AfriPlay could only test on MTN mobile data. WONA: same check, decided 2026-10-28 (off-Econet users see "not on this network").

## Images

- URL: `${CLIENT}/api/client/v1/global/images/${id}?accessKey=WkVjNWNscFhORDBLCg==` (public). APIs return ids, not URLs.
- Banner image ids change day to day — never hardcode or cache.
- `title_art_image_id` only on vod/content rows (build an id → title-art map); was null everywhere on AfriPlay → text fallback.
- `banner_image_id` may be a pre-composed portrait mobile hero; use `preview_image_id` (1920×1080) for crops.
- Heading images have mixed aspect ratios → `object-cover`. Cap promo banner height.
- Static assets must be `import`ed, not referenced by string path.

## Video (HLS)

- All stream/trailer URLs are `.m3u8` → hls.js unless `video.canPlayType("application/vnd.apple.mpegurl")` (Safari).
- Avoid the blurry start: `new Hls({ autoStartLoad:false, capLevelToPlayerSize:false, abrEwmaDefaultEstimate:5_000_000 })`, on `MANIFEST_PARSED` set `startLevel` to the top level, then `startLoad()`.
- Fatal errors: `NETWORK_ERROR` → `hls.startLoad()`; `MEDIA_ERROR` → `hls.recoverMediaError()`.
- Autoplay: `play().catch(() => { video.muted = true; video.play().catch(() => {}) })`; always `playsInline`.
- Set `video.muted` imperatively in an effect — React's `muted` prop doesn't stick.
- Render only one hero/player (desktop **or** mobile), or the hidden one plays audio too.

## Homepage (CRM-driven)

`GET {CM}/api/client/?operator_uid={ouid}&mode=web` (no auth). Match category uids case-insensitively.
`mode=web` and `mode=app` are different CRM profiles — rail differences vs the mobile app are CRM config, not code.

AfriPlay render order: banners → 1st VOD category → 1st channel category → promo banner → (halfway) `branded` genre categories → remaining VOD → `featured` channel category (skip if same as 1st) → last VOD. ❓ Confirm WONA's order against its Figma/brief. Verify every slot actually renders (AfriPlay fetched the channel rail but never drew it).

## Layout

- AfriPlay's `--vw: clamp(768px,100vw,1728px)` scaling shrank everything to 0.444× on phones. Plan mobile from day one with its own basis (`clamp(320px,100vw,430px)`, 390 design width) and scale text/padding/radii inside cards, not just the box.
- Every mobile route needs a working top bar (AfriPlay shipped dead bell/menu buttons).

## Styling

- Tailwind 4 only outputs a `@theme` variable when some class uses it, so `var(--color-x)` in inline styles came out empty → declare tokens with `@theme static`. `✅ VERIFIED` WONA 2026-10-26.

## Styling

- Tailwind 4 only outputs a `@theme` variable when some class uses it, so `var(--color-x)` in inline styles came out empty → declare tokens with `@theme static`. `✅ VERIFIED` WONA 2026-10-26.

## Dev process

- Dev flags in gitignored `.env.local`; restart Vite after changing them.
- Discover shapes by logging real responses (dev-only), then map fields; spec is behind VPN (`https://172.20.1.10:11401/docs/api/client/`).
- Run `npm install` after pulling commits that change dependencies.
- `git push` can hang on the credential prompt → `gh auth setup-git` once.
- Check merge-base/overlap before merging an old branch (it once clobbered the wiki).
