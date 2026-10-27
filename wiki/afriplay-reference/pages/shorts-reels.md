# Screen — Shorts / Reels (feed & player)

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` DESKTOP (build passes, 2026-07-16). See "Mobile-pivot claim was stale" below —
> the 2026-06-08 mobile build described in this page's prior version does not exist on disk.

**Routes:** `/shorts` (feed) · `/shorts/:id` (player) `✅ VERIFIED`

## Figma frames

| State | Node | Link |
|-------|------|------|
| Feed / grid | `2883:10025` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10025&m=dev |
| Playing | `2883:10145` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10145&m=dev |
| Playing (incoming reel) | `2883:10252` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10252&m=dev |

## 🪦 STALE — mobile-pivot claim (2026-06-08 entry), corrected 2026-07-16

The prior version of this page claimed a 2026-06-08 "pivot to mobile-only": desktop deleted,
a mobile `ShortsPage`/`ShortsPlayerPage` built and `✅ VERIFIED`. On 2026-07-16, both the user
and a fresh read of the repo confirmed this is **not what's on disk**:
- `ShortsPage.jsx` is (and per git history — commit `1f95e50` — has continued to be) the
  **desktop** grid/sidebar feed, not a phone-column mobile layout.
- No `ShortsPlayerPage.jsx` existed at all until this session (2026-07-16) — `/shorts/:id`
  was commented out in `App.jsx` with a note that it was pending a rebuild.
- `MobileTopBar.jsx` / `MobileBottomNav.jsx` still exist under `src/components/shared/` but
  nothing imports them — orphaned leftovers, not wired into any route.

Likely explanation: the mobile build described really happened at some point, then was
reverted/superseded by a later desktop-first direction, without the wiki being corrected.
Treat any other claim in [[open-questions]] or [[figma-frames]] about "mobile Reels being
live" as suspect until re-verified against disk.

## Composition (see [[components]]) — current desktop build

**Feed:** `ShortsFilterChips` · `ShortsAvatarRail` (circular thumbs) · `ShortGridTile` ×16
("For You" brick grid) · `LiveReelBanner` (right sidebar) · `TrendingNowSidebar` (right sidebar)

### `ShortGridTile` spec — Figma `4041:27263` `✅ VERIFIED` 2026-07-30
Read off Components 5/6 and **measured in the rendered DOM at a 1728 viewport** (where the fluid
`calc(N/1728*var(--vw))` classes resolve 1:1 to comp px), so these are confirmed, not inferred:

| property | value |
|---|---|
| tile | 245 × **285** (tall) / **207** (short), radius **20**, `overflow-clip` |
| grid | 4 columns, **16** gap both axes (cols at x 0/261/522/783) |
| title | **overlaid on the poster**, 20px semibold, `line-height 1.2` (24), `gray-1/95`, **`line-clamp-2` + ellipsis** |
| views | 16px regular, line-height 16, `gray-1/55` (hidden for API content — brief ignores counts) |
| text block | absolute, left **16**, **bottom 20** (bottom-anchored: tall top 191 + 74 = 20 off the bottom; short top 113 + 74 = 20 — same inset, so don't offset per height) |
| duration pill | `right 12 / top 9`, `bg rgba(31,8,50,0.6)` = **`surface-purple/60`**, radius 100 (`rounded-full`), padding 10/6, 12px semibold white |
| scrim | full-card wash `transparent → black/30` + a bottom gradient for legibility (the comp uses blurred rotated scrim layers `rgba(0,0,0,.24)→.6`; reproduced as a plain bottom gradient) |

🪦 `STALE` — the pre-2026-07-30 build stacked the title/views **below** the poster (18px `text-lg`,
`gray-1`, `line-clamp-1`), used `rounded-lg` cards, a **24** grid gap, and an opaque `purple-11`
`rounded-md` pill at 10px text. All wrong against the comp; corrected in `ShortGridTile` + the
`Badge` `duration` variant + `ShortsPage`'s grid constants.

⚠️ **Not covered:** the mobile feed's tile (`MobileShortsPage`'s inline `ForYouTile`) already
overlays its title but was **not** checked against a mobile Figma node — the frame above is the
desktop comp. `MobileShortGridTile` remains unused by any page.

**Player:** back button · `ReelPlayerCard` (video card: mute/fullscreen/more in ONE top-right
pill container, center play/pause, double-tap like burst + paused hint text, scrub bar) ·
`ReelCaptionPanel` (page bottom-left, OUTSIDE the card) · `ReelActionRail` (own column, right
of the card: follow avatar, like — neutral circle, heart-only gold when liked (`HeartIcon`
inline SVG; the shipped asset hardcodes gold) — share, My Stuff) · `ReelNavArrows` (absolute
at the page's right edge). Single click video = play/pause (250ms guard); double click =
toggle like (with burst).

## Implementation notes `✅ VERIFIED` (2026-07-16, `npm run build` passes)

**Pages**
- [src/pages/ShortsPage.jsx](../../src/pages/ShortsPage.jsx) — desktop feed, two-column
  layout (main grid + right sidebar), fluid-scaled to the 1728px comp.
- [src/pages/ShortsPlayerPage.jsx](../../src/pages/ShortsPlayerPage.jsx) — desktop player,
  built 2026-07-16. `resolveReel(id)` (in `shortsFixtures.js`) resolves the route id: checks
  `reels` first, falls back to synthesizing a reel from a matching `forYouGrid`/`trendingNow`
  item so every feed tile is clickable. ↑/↓ keys, nav arrows, **and mouse-wheel scroll**
  (one gesture = one step, 600ms lock against the many small `wheel` events a single scroll
  fires) all step through `reels`. ~~Wrap-around at either end~~ 🪦 **Bounded since
  2026-07-17 (user direction)**: no up from the first reel, no down from the last — each
  arrow only renders when a reel exists in that direction (`ReelNavArrows`
  `showUp`/`showDown`); fallback reels sit "before" the queue (↓ only, entering at reel 1).
  Reel steps `navigate` with `replace: true` (one viewing session = one history entry) and
  back/Esc use a real `navigate(-1)` when in-app history exists. Own `MainLayout` instance
  with `showFooter={false}` — no footer at all on this route (full-bleed player), unlike
  every other screen which gets the reveal-footer effect (see [[search]] for the
  `MainLayout` prop details).

**Shorts-specific sections/cards** — `src/components/sections/shorts/`, `src/components/cards/`
`ShortsFilterChips`, `ShortsAvatarRail`, `LiveReelBanner`, `TrendingNowSidebar`, `ShortGridTile`,
`TrendingListItem`, `ReelPlayerCard`, `ReelActionRail`, `ReelCaptionPanel`, `ReelNavArrows`.
`ReelCaptionPanel`'s hashtags render `text-prim-gold` (fixed 2026-07-16 — they were gray, the
reference screenshot shows them gold).

**State / data**
- Slice [src/store/slice/shortsSlice.js](../../src/store/slice/shortsSlice.js).
- 🪦 `STALE` — "API stub [src/api/shorts.js], `// TODO: missing API`". **Superseded 2026-07-30:**
  `api/shorts.js` is live-wired — rail categories/content, vertical trailers, and (new) the feed
  **banner** + **Trending Now** row. See [[api-contract]] for the verified shapes.
- Fixtures [src/data/shortsFixtures.js](../../src/data/shortsFixtures.js) — `resolveReel`.
  Now the *fallback* only (fixtures mode / signed-out / empty rail), not the primary source.
- 🪦 `STALE` — "`LiveReelBanner` + `TrendingNowSidebar` have no endpoint in the brief, fixtures are
  authoritative." **Resolved 2026-07-30 by live probe:** the banner is the rail category's
  `heading_image_id` and Trending Now is the trending rail's items. Both now flow through
  `shortsSlice.liveReelPreview` / `.trendingNow` into **both** the desktop sidebar and the mobile feed.
  The banner's LIVE badge / `@handle` / view count have no API source and are **suppressed in API mode**
  instead of invented ([[open-questions]] #23).

**Wiring**
- [src/App.jsx](../../src/App.jsx) — `/shorts` and `/shorts/:id`, both under their own
  `MainLayout revealFooter` instance (desktop Navbar + reveal-footer scroll effect).

**Known limitations** `⚠️ ASSUMPTION`
- Only a still image ships per reel (`comments-reel-player-reel-video.webp`) — no real video
  file. Play/pause/scrub are UI-only.
- "Watch full episode" CTA is a no-op placeholder (same pattern as the feed's "See More"
  button) — no title/detail route exists yet to link to.
- Player video card width (420px @ 1728 comp) is an assumption — exact Figma dimension for
  node `2883:10145` isn't in the [[figma-frames]] raw dump.
- `MobileTopBar.jsx` / `MobileBottomNav.jsx` remain unwired. If a mobile pass is wanted later,
  decide then whether to reuse these or rebuild — don't assume they still match the design.
