# Screen — Search Results

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — built 2026-07-15 (desktop), grid/skeleton corrected 2026-07-16. Input in [[search]], failures in [[search-edge-cases]].

**Sheet group:** SEARCH RESULTS · **Route:** `/search?q=...` `✅ VERIFIED` (synced via `useSearchParams`)

## Figma frames
| State | Node | Link |
|-------|------|------|
| Top results (all) #1 | `2883:10916` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10916&m=dev |
| Top results (all) #2 | `2883:11017` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11017&m=dev |
| Top results (all) #3 | `2883:11118` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11118&m=dev |
| Filter: Movies | `2883:11219` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11219&m=dev |
| Filter: TV Shows | `2883:11269` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11269&m=dev |
| Filter: TV Channels | `2883:11316` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11316&m=dev |
| Slow internet / skeleton | `2883:11362` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-11362&m=dev |

## Composition (see [[components]])
`navbar` · `search-bar` · `result-type-tabs` · `results-count` ·
`movies-results-section` · `tv-shows-results-section` · `tv-channels-results-section` ·
`results-skeleton` (+ per-type skeleton sections)

## Notes
- Result-type tabs: All / Movies / TV Shows / TV Channels. Skeleton mirrors the same section layout.

## Implementation notes
- Built 2026-07-15 as part of [SearchPage](../../src/pages/SearchPage.jsx) (not a separate route — same stateful screen as [[search]], switched on whether `debouncedQuery` is non-empty). [SearchResultsSection](../../src/components/sections/search/SearchResultsSection.jsx) renders the result-type tabs (All/Movies/TV Shows/TV Channels) + results-count, then results grouped into their own labeled `movies-results-section` / `tv-shows-results-section` / `tv-channels-results-section` (matches Composition above) — even on a single-type tab, that group just ends up the only one with items.
- **Grid tiles corrected 2026-07-16**: Movies/TV Shows now use a new [CompactPosterTile](../../src/components/cards/CompactPosterTile.jsx) (poster-only, `aspect-[2/3]`, 250px @ 1728 comp) instead of the big `PosterCard` — the results reference screenshot shows 6 smaller tiles per row, not `PosterCard`'s 4. `PosterCard` stays as-is for the Search landing "Recommended" grid and Home's rails, where 4/row with title+Play/Add overlay is correct. TV Channels still use `ChannelCard` (388px, ~4/row) — screenshot shows the same count for that row, unchanged.
- "Top results" hero (Figma `results-featured-result`) renders on the All tab as `bestResult` — dedicated `results-featured-result-best-result-hero-bg.webp` / `-title-art.webp` assets, fixed to the "Prison Break" fixture (not query-dependent — `⚠️ ASSUMPTION`, revisit once there's a real top-result ranking signal).
- **Skeleton (`2883:11362`) built 2026-07-16** — closes the `❓ NEEDS-CLARIFICATION` below. See [[search-edge-cases]]'s `SearchingLoader`, now a placeholder-box skeleton (hero + 3 grouped tile rows matching this page's real layout) instead of a spinner.
- `?q=` now round-trips through the URL (`useSearchParams`, replace-not-push) — added 2026-07-16 to match this page's documented route; previously query state was local-only.
