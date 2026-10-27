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
