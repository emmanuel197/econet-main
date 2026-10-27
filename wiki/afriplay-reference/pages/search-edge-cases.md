# Screen — Search Edge Cases

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — built 2026-07-15 (desktop), `SearchingLoader` rebuilt as a real skeleton 2026-07-16. Happy path in [[search]] / [[search-results]].

**Sheet group:** EDGE CASES

## Figma frames
| State | Node | Link |
|-------|------|------|
| Short query (min-chars hint) | `2883:11435` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11435&m=dev |
| Search in progress | `2883:11587` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11587&m=dev |
| Zero results #1 | `2883:11657` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11657&m=dev |
| Zero results #2 (did you mean) | `2883:11728` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11728&m=dev |
| Network error | `2883:11820` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11820&m=dev |
| Toast (added to My Stuff) | `2883:11911` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11911&m=dev |

## Composition (see [[components]])
`min-chars-hint` · `searching-loader` · `zero-results-message` (+ "did you mean") ·
`connection-error-message` · `toast-notification` · plus `browse-by-categories-section` /
`recommended-section` / `recent-searches-section` / `trending-searches-section` as fallback content

## Notes
- Min query length threshold resolved as **2 characters** — `⚠️ ASSUMPTION` (`MIN_QUERY_LENGTH` in [searchFixtures.js](../../src/data/searchFixtures.js)), no Figma spec gave an exact number. See [[open-questions]] #6 (closed).

## Implementation notes
- Built 2026-07-15 in [SearchEdgeStates.jsx](../../src/components/sections/search/SearchEdgeStates.jsx) — `ShortQueryHint`, `SearchingLoader`, `ZeroResultsMessage`, `NetworkErrorMessage`, `AddedToast`, all rendered as states of [SearchPage](../../src/pages/SearchPage.jsx) rather than the fallback content getting its own components (recent/trending/browse/recommended sections are reused as-is from [[search]] landing state for the fallback slot).
- **Two distinct loading states as of 2026-07-17** (user's reference screenshots clarified they're both real): `SearchingLoader` = spinner + "Searching…" shown **inside the suggestions panel** while the debounce is pending ("SEARCH IN PROGRESS" frame); `ResultsSkeleton` = the placeholder-box skeleton (hero + 9/6/4 tile rows matching [SearchResultsSection](../../src/components/sections/search/SearchResultsSection.jsx)'s real layout) for the **page-level slow-network** state (`2883:11362`), forceable via `/search?loading=1` for demos.
- **All edge states render inside the panel while it's open** (2026-07-17): short-query hint, spinner, Connection Error ("We couldn't reach the server…" + gold ⟳ Try Again), and zero results ("No results for" + query in gold) — page-level duplicates are suppressed while focused. Zero/error components restyled to the reference copy.
- **Zero results #2 "did you mean"** (`2883:11728`): resolved as a static suggestion (`trendingSearches[0]`), not a real fuzzy match against the typed query — `⚠️ ASSUMPTION`, weaker than the client-fuzzy-match approach [[open-questions]] #7 originally proposed. Revisit if this reads as misleading (e.g. suggesting an unrelated trending term).
- **Network error** (`2883:11820`): demo-only trigger — typing the exact query `"offline"` (case-insensitive) simulates it, since there's no real network call yet to fail against. Remove once a real `/api/search` call replaces the client-side filter in [api/search.js](../../src/api/search.js).
- **Toast** (`2883:11911`): fires from clicking any result/recommended `PosterCard`, auto-dismisses after 2.2s.
