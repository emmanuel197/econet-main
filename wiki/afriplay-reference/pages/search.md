# Screen — Search (landing & input states)

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — built 2026-07-15 (desktop), landing state corrected 2026-07-16.
> Results in [[search-results]], failures in [[search-edge-cases]].

**Sheet group:** Search Functionality - Desktop · **Route:** `/search` `✅ VERIFIED` (registered in App.jsx 2026-07-15)

## Figma frames
| State | Node | Link |
|-------|------|------|
| Landing | `2883:4757` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-4757&m=dev |
| Has recent searches | `2883:4841` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-4841&m=dev |
| AutoComplete | `2883:4988` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-4988&m=dev |
| Remove two recent | `2883:5103` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-5103&m=dev |
| Clear all recent | `2883:5230` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-5230&m=dev |

## Composition (see [[components]])
`navbar` · `search-bar` · `genre-filter-chips` · `recent-searches-section` ·
`trending-searches-section` · `autocomplete-suggestions` · `search-results-grid` ·
`browse-by-categories-section` · `recommended-section`

## Notes
- Recent searches are client-side `✅ VERIFIED` — `localStorage` key `afriplay:recentSearches`, no API contract exists yet (still `❓` for whether this should later sync server-side).
- ~~AutoComplete (`2883:4988`) was **not** built~~ ✅ **Built 2026-07-17**: typing with the suggestions panel open shows live title suggestions (query echo + up to 3 matches with search icons) + a grid of matching poster tiles, inside the same flush black panel. Enter commits the raw query immediately (skips debounce); clicking a suggestion/poster commits that title. Recent Searches inside the panel is a vertical column (clock icon + label + X per row, no pills). Demo routes: results `/search?q=love`, forced skeleton `/search?loading=1`.

## 🪦 STALE — landing state had two bugs, fixed 2026-07-16

The 2026-07-15 build's landing state didn't match the Figma landing screenshot the user
supplied 2026-07-16:
1. `genre-filter-chips` (listed in Composition above) was never actually built — the row of
   plain-text pills (New, Thriller, Stand-Up, Events, AfriPlay Originals, Fantasy, Crime,
   War & Military, 4K HDR, Nollywood, Reality TV, Talk Shows, Sports) under the search bar
   didn't exist in code.
2. `SearchPage.jsx` rendered the categories **twice** — `BrowseCategoriesSection` (correct
   component) plus a duplicate inline grid — both pulling `searchFixtures.browseCategories`
   (Horror/Documentary/AI Clips/Animation, the dedicated-but-incomplete 4-asset set flagged
   below). The screenshot shows a single category row: Action/Comedy/Drama/Sci-Fi/Kids &
   Family — which is `homeFixtures.genres` (Home's Genres rail data), not `browseCategories`.

Fixed: added `GenreChipsRow` (new component) + `searchFixtures.genreChips` (new fixture,
hand-authored from the screenshot — no dedicated Figma asset/copy source, `⚠️ ASSUMPTION`
on exact label set); `BrowseCategoriesSection` now takes `homeFixtures.genres` as its `items`;
removed the duplicate grid. `searchFixtures.browseCategories` (Horror/Documentary/AI Clips/
Animation) is kept in the fixture file, unused, per user's call — no home for it yet.

## Implementation notes
- Built 2026-07-15, landing state corrected + suggestions overlay added 2026-07-16. [SearchPage](../../src/pages/SearchPage.jsx) is one stateful screen covering landing + results + edge cases (not separate routes — see [[search-results]] impl. notes for why).
- Landing state: [GenreChipsRow](../../src/components/sections/search/GenreChipsRow.jsx) (`searchFixtures.genreChips`, enlarged 2026-07-16 — padding/text/gap were smaller than the design), [BrowseCategoriesSection](../../src/components/sections/search/BrowseCategoriesSection.jsx) (reuses `homeFixtures.genres` + `GenreCard`, hover-zooms), plus a "Recommended for You" grid (reuses `PosterCard`, hover-zooms) — 8 shown initially with icon-only See More/See Less buttons (the exported `search-recommended-see-more-arrow-down.svg`, rotated 180° for "less" — no manually-typed label) that page through the 18-item pool 8 at a time in either direction.
- **Suggestions overlay** (2026-07-16): [RecentSearchesSection](../../src/components/sections/search/RecentSearchesSection.jsx) + [TrendingSearchesSection](../../src/components/sections/search/TrendingSearchesSection.jsx) (previously unused imports — [[open-questions]] #21, now closed) render as a dropdown panel over a dimming backdrop (no blur) while the search input is focused and empty (not part of the static landing state — resolves `2883:4841` "Has recent searches" as a focus state, not a separate route). Closes on outside-click, `Escape`, or selecting a suggestion. Uses the focus/blur-bubbling-with-`relatedTarget`-check pattern on the wrapping container, not raw DOM focus/blur, so clicking a suggestion inside the panel doesn't prematurely close it. `SearchBar`'s new `active` prop makes it render flush with the panel below it (`bg-gray-10`, matching rounded corners, no gap) so both read as one continuous black card rather than a pill floating over a separate box. `RecentSearchesSection` caps to 5 visible with a gold "See More" (`search-edge-recent-searches-see-more-chevron.svg`) revealing the rest; `TrendingSearchesSection`'s header has a small gold chevron (`search-trending-searches-sort.svg`) for visual parity with the design.
- Search bar is `autoFocus`-free (was forcing the overlay open on every landing) and full-width (was capped at `max-w-1200` while the chip row/category grid/recommended grid all span the full ~1622px content column — now aligned).
- Shared [SearchBar](../../src/components/shared/SearchBar.jsx) — also used by [[live-tv-epg]]. `Navbar`'s search icon links here and turns gold when `/search` is active (matching the other nav items' existing treatment).
- Data: [searchFixtures.js](../../src/data/searchFixtures.js) — `library` array is the searchable catalog (reuses Home's real titles + the dedicated `search-recommended-poster-*` set with placeholder titles). No `/api/search` yet.
- `browseCategories` (Horror/Documentary/AI Clips/Animation, only 4 shipped) is defined but unused as of 2026-07-16 — see stale note above.
- Footer: `showFooter={false}` — no footer at all on this page (own `MainLayout` instance in App.jsx), corrected 2026-07-16 after a brief stint of having the reveal-footer effect. The results/skeleton states are meant to be a self-contained block ("Hug"-sized in Figma), not followed by a footer. [[live-tv-epg]]/[[home]] keep the reveal-footer effect — see `MainLayout`'s `showFooter`/`revealFooter` props.
