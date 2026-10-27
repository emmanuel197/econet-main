# Log

## 2026-10-26 — Project started
- Fresh repo `wona-web` (not a copy of AfriPlay / econet-main). Vite + React + Router + Tailwind scaffold;
  homepage placeholder shows operator + API config. Build and dev server verified.
- Ingested the operator brief → `raw/operator-brief.md`.
- Carried AfriPlay's known problems over → `pages/known-pitfalls.md`.
- Figma not yet readable: Figma Dev Mode MCP disabled and figma-console token expired → `pages/open-questions.md`.

## 2026-10-26 — Moved into the econet-main repo
- The scaffold built in a separate `wona-web` folder now lives in `econet-main` (GitHub `emmanuel197/econet-main`, default branch `edward`),
  replacing the earlier AfriPlay copy ("econect early stages", 7e2a9da). Old untracked AfriPlay files moved to `C:\Users\bizza\econet-main-afriplay-leftovers` (local only).
- Figma access restored via figma-console (token refreshed) → open question #1 resolved.

## 2026-10-26 — Phase 1: design tokens
- Tallied colours/fonts/radii from visible nodes on Figma page 4041:1094 (no published styles readable) → `pages/design-system.md`; tokens in `src/styles/global.css`.
- Mapped every frame on the page → `pages/screen-map.md`. Desktop home `4041:21334` is hidden-content; use `4041:21538`. Auth/details/watch/profile/subscriptions screens are not on this page.
- Exported nav logo SVG → `src/assets/brand/wona-logo.svg`.
- Dev-only `/design` preview page. Gotcha: Tailwind 4 drops @theme variables no class uses → `@theme static`.

## 2026-10-26 — Phase 1: design tokens
- Tallied colours/fonts/radii from visible nodes on Figma page 4041:1094 (no published styles readable) → `pages/design-system.md`; tokens in `src/styles/global.css`.
- Mapped every frame on the page → `pages/screen-map.md`. Desktop home `4041:21334` has hidden content; use `4041:21538`. Auth/details/watch/profile/subscriptions screens are not on this page.
- Exported nav logo SVG → `src/assets/brand/wona-logo.svg`.
- Dev-only `/design` preview page. Gotcha: Tailwind 4 drops @theme variables no class uses → `@theme static`.

## 2026-10-27 — Switched to the AfriPlay codebase
- Deadline: replaced the from-scratch scaffold with the AfriPlay revamp code, re-branded for WONA (operator, colours, logo, wording) → see `pages/project-structure.md`.
- AfriPlay wiki kept under `wiki/afriplay-reference/`.
- Verified: build passes; `/home` renders with WONA colours and logo using fixtures + auth bypass.

## 2026-10-27 — Navbar, footer and mobile bars matched to WONA Figma
- Desktop nav (`components/shared/Navbar.jsx`, Figma instance 4041:21741): full-width 98px glass bar, logo left, six centred links (Home, Live Tv, Shorts, Tv Channels → `/tv-guide`, Movies, My stuff), search + bell + 48px avatar. "Get Bundle" removed (not in WONA desktop design) → Subscriptions moved into the avatar dropdown.
- Footer (`components/ui/Footer.jsx`, 4041:21740): layout already matched; AfriPlay purple glow image replaced by the WONA blob gradient, top border recoloured.
- Mobile: Get Bundle pill restyled to WONA (navy glass, pink border, 94×32); bottom nav restyled to Figma "Frame 171" (348×66 white/10 glass, 20px icons, 11px labels). Bell + avatar kept on mobile although the mobile home comp shows only Get Bundle (they hold notifications and the account menu).
- Gotcha: recolouring SVG gold → pink broke vite.config's svgr `var(--stroke-0, #c2b801)` → currentColor mapping; updated it to `#da1375`.

## 2026-10-27 — Homepage matched to WONA Figma (desktop 4041:21538, mobile 4041:1130)
- Desktop order already matched. Added the promo banner in fixture mode (between Live On Tv Now and Top 10); removed the AfriPlay-only "Upcoming TV Shows" rail from desktop. Top 10 numerals now `#d97aa9`, extra-bold, 3px `#e7eaf4` outline.
- Mobile comp differs from desktop and is now followed: Wonashorts → Keep Watching → **WonaPremiere** (new `components/cards/PremiereCard.jsx`) → Because You Watched → Live on TV Now → Top 10 Movies & Shows → New Release → Browse Live Channels → **Trending Now** → **Wona Bundle** promo (new `components/cards/BundlePromoCard.jsx`) → Only on Wona → **Upcoming TV Shows** (wide 245×303). No Genres and no promo banner on mobile.
- Per-rail mobile title styles via new `mobileTitleClassName` prop (ContentRail → SectionHeader); default mobile heading is now 16px semibold (was 17px bold).
- Mobile card sizes now follow the comp: posters 118×182 (artwork only, 5px radius, `#e1e7f8` border), Keep Watching 199×130, Live 155×95, channels 164×92.
- New images from Figma image fills → `assets/images/home-mobile-*.webp`.

## 2026-10-27 — Search matched to WONA Figma (desktop 4041:21947/22031/27874, mobile 4041:5305/5407/7338)
- Desktop landing: no "Search" title; 74px black/40 bar at y160; chips black/35 at 56%; "Browse By Categories" (20px semibold + arrow) with full-size 330×224 cards (`GenreCard large`); "Recommended" 28px semibold, 3 rows of 6 in a CSS grid (fixed widths wrapped to 5 because the scrollbar eats ~15px).
- Poster tiles (`CompactPosterTile`): 253×348, 16px radius, 1.8px `#eef0f7` border (was pink). See More: white/30 glass pill.
- Desktop panel: one 40px-radius black/70 card, pink underline under the input, 18px semibold titles, pink "Clear All", 44px recent rows, outlined pink trending numerals with hairline dividers.
- Desktop results: 18px tabs, "Found N results for ”q”" 20px semibold, Best Results hero inset 56px / 550 tall / 24px radius / 2px border with a navy "Best Results" tag; 28px group titles with zero-padded counts; 6-col grid; channels scroll in a row. Zero results: `Did you mean: ”…?”`.
- Mobile: the empty state is now Recent + Top 5 Trending + Browse By Categories (AfriPlay showed a browse/results grid until the box was focused). No app bar on mobile search (`mobileTopBar="status"`), as in the comps. 111×124 category cards, 16px semibold titles, results tiles with `#e1e7f8` hairline.

## 2026-10-27 — Live TV / EPG matched to WONA Figma (desktop 4041:22861, mobile 4041:13023)
- Layout already matched (search, category chips, featured panel, On Air Today + All Live Channels).
- Desktop featured panel (`FeaturedLiveProgram`): black/32, 24px radius, 40px padding, 549 tall; viewer count + "SuperSport · Ch 5" at 18px/60%; whole title pink 30px semibold; scoreboard 44px with a red minute pill; 450px image. The curated featured programme (scoreboard, viewers) now shows on load — `activeChannelId` starts null; picking a channel still restages the panel.
- Sidebar: 18px semibold header with black/32 count pill, pink "See All", 24px card gap. On Air Today: 18px semibold heading, 16px date/tabs.
- Mobile: title 16px semibold, chips 12px (active white text), meta 10px `#9e9e9e`, channel name `#9999b2`, featured title 18px semibold, white Watch Now text, glass Full Guide, list header 14px; AfriPlay purple `#160a29` removed from the featured gradient.
- Figma image renders are rate-limited (429, retry-after ~85h) — comparisons used the cached node data (`/v1/files/.../nodes`) instead.

## 2026-10-27 — Shorts / Reels matched to WONA Figma (desktop 4041:27213/27349, mobile 4041:10665/10530 + spec frames)
- Desktop feed: "Shorts for You" 30px medium (all white), 18px subtitle, 18px chips (active pink, white text). Live preview (`LiveReelBanner`) is now a 381×286 full-bleed card with a 2px red border, Live pill, pink creator handle, title and views on the artwork. Trending: 22px heading, 30px `#ec1882` rank circles, 18px titles, 14px counts, 14px radius.
- Desktop player: caption 18px bold handle, 16px badge/caption, white-text "Watch full …" CTA, 14px bold hashtags; action labels 14px semibold pink, save action reads "My List"; 14px times. Player kept at 420px wide (comp is 500×881) so the 9:16 video fits 1080p laptop screens — see open questions.
- Mobile feed/player: "WonaShorts"/"Wonashorts" 16px semibold headers, 12px chips, comp text sizes throughout; `@AfriSportsHQ` fixture handles → `@WonaSportsHQ`; share link domain `afriplay.com/r/…` → `wona.com/r/…` (per the Share Reel spec).
- Spec frames say "gold" heart/ring/pill (copied from AfriPlay) — implemented with WONA pink.

## 2026-10-28 — Undesigned screens and open design questions resolved "the AfriPlay way"
- Decision (user): where WONA has no design or the question is open, keep AfriPlay's behaviour but make it look WONA. Data/API questions (#3, #6, #10–12, #14, #18, #21) and repo/branch questions are with the PM.
- Sign-in, OTP, out-of-region, details, watch, My Stuff, profile, subscriptions, history, notifications, TV guide, Movies checked desktop + mobile: removed AfriPlay purple from the auth backdrop (`AuthShell`), flag badge and watch-page glow; FAQ "AfriPlay" → "WONA"; "only for MTN subscribers" → "Econet"; profile support contacts (MTN Ghana) → "To be confirmed".
- All pink buttons/chips/badges now use white text (WONA comps) instead of AfriPlay's dark-on-gold `text-page` (26 places, incl. the shared `Button` primary variant).
- Mobile search gets its app bar back (AfriPlay behaviour) so the bell/account menu are reachable there.
- Subscription prices still show "GHS" — package data, with the PM.
