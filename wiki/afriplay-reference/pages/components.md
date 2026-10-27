# Components Catalog

> Recurring macro-components across screens. Distilled from [[figma-frames]] tab 2 (raw).
> Tags: see [[CLAUDE]]. Status: `🔗 EXTERNAL` — design only, no built components yet.

Components are listed once here; each screen page lists which it uses. Node IDs in
[[figma-frames]] (a component repeats per screen state with a different node — use the screen's
own frame for the exact instance).

## Shared shell
| Component | Used by |
|-----------|---------|
| `navbar` | nearly every screen |
| `footer` | [[home]], [[shorts-reels]], [[live-tv-epg]] |
| `search-bar` | [[search]], [[search-results]], [[search-edge-cases]], [[live-tv-epg]], [[live-tv-filters]] |
| `toast-notification` | [[search-edge-cases]] (Added to My Stuff) |

### Mobile top-nav contract `✅ VERIFIED` 2026-07-30 (Playwright audit of all 15 mobile routes)
Below `md`, `MainLayout` renders `MobileTopBar variant="app"` (logo + actions) — **unless** the
route passes `mobileTopBar="status"` (page supplies its own header) or `mobileChrome={false}`
(immersive players). That opt-out is what fragmented the nav, so:

- **`MobileNavActions`** (`components/shared/MobileNavActions.jsx`) is now the single source for the
  right-hand cluster — Get Bundle · notification bell + unread badge + `NotificationsPanel` ·
  avatar + account menu · signed-out log-in link. **Any mobile header must use it**; hand-rolling
  those controls is how `/shorts` and `/live` ended up with a bell that had no handler and no
  account menu at all (and, on `/shorts`, a button labelled "Notifications" that rendered the
  avatar).
- Pages that legitimately own their header (`mobileTopBar="status"`): `/shorts` (AfriShorts title),
  `/live` (Afriplay Live Tv title). They render `<PageTitle/> + <MobileNavActions/>`.
- A route may only use `mobileTopBar="status"` if it **actually renders its own header**. `/tv-guide`
  inherited the flag by sharing `/live`'s route group and shipped with no top nav; it now has its
  own group. `/search` likewise had none (its search field is a control, not a header) and now gets
  the standard bar, with page `pt` raised to 62 (`--mvw`) to clear the 46px bar.
- Only `/watch/:type/:id` and `/shorts/:id` intentionally have no top nav (`mobileChrome={false}`).
- Regression check: `scratchpad/audit-topnav.js` walks every route, lists the visible top-region
  controls and asserts the bell + account dropdowns open. **Careful:** the desktop `Navbar` and
  `Footer` stay in the DOM below `md` (`hidden md:block`), so any such probe must filter by a
  non-zero bounding box or it will match the hidden desktop controls.

## Home rails
`hero` · `afriplay-shorts-section` · `keep-watching-section` · `because-you-watched-section` ·
`live-on-tv-now-section` · `top-10-movies-section` · `genres-section` ·
`new-release-on-afriplay-section` · `browse-live-channels-section` · `only-on-afriplay-section`
→ [[home]]

## Shorts / Reels
`shorts-for-you-section` · `live-reel-preview-card` · `for-you-grid-section` · `trending-now-section` ·
`reel-player` · `reel-info-card` · `reel-action-rail` · `incoming-reel` · `nav-arrows` · `back-arrow`
→ [[shorts-reels]]
🪦 **REMOVED 2026-06-05** (deleted from Figma): ~~`comment-drawer`~~ · ~~`comment-drawer-empty`~~ ·
~~`login-prompt-modal`~~ — and the `comment` action dropped from `reel-action-rail`. See
[[shorts-comments]] (tombstoned) + [[figma-frames]] append log.

## Search
`genre-filter-chips` · `recent-searches-section` · `trending-searches-section` ·
`autocomplete-suggestions` · `search-results-grid` · `browse-by-categories-section` ·
`recommended-section` · `result-type-tabs` · `results-count` · `movies-results-section` ·
`tv-shows-results-section` · `tv-channels-results-section` · `results-skeleton` (+ per-type skeletons) ·
`min-chars-hint` · `searching-loader` · `zero-results-message` · `connection-error-message`
→ [[search]], [[search-results]], [[search-edge-cases]]

## Live TV / EPG
`channel-category-tabs` · `featured-live-program` · `on-air-today-schedule` · `live-channels-sidebar`
→ [[live-tv-epg]], [[live-tv-filters]]

## Mobile-only (added 2026-06-05 — see [[figma-frames]] append log)
New components appearing only in the Mobile frames (Home + Video Playing):
`top-app-bar` · `category-tabs` · `bottom-nav-bar` · `afriplay-bundle-promo` ·
`upcoming-tv-shows-section` · `trending-now-section` (also on mobile Home, not just Shorts)
→ mobile [[home]]. Whether these reach desktop is [[open-questions]] #19.

## Notes
- Naming above is kebab-case from Figma. Map to code component names in [[conventions]] once decided.
- Sheet has name typos (see [[open-questions]] #18); kebab-case names above are normalized.
