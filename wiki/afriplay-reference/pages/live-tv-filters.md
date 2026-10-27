# Screen — Live TV Category Filters

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — built 2026-07-15 (desktop). Base EPG screen in [[live-tv-epg]].

**Sheet group:** EP filter · **Route:** `/live?category=...` `✅ VERIFIED` (synced via `useSearchParams`)

## Figma frames
| Category | Node | Link |
|----------|------|------|
| Sport | `2883:7953` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-7953&m=dev |
| News | `2883:8254` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-8254&m=dev |
| Entertainment | `2883:8555` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-8555&m=dev |
| Movies | `2883:8738` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-8738&m=dev |
| Kids | `2883:8901` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-8901&m=dev |
| Search bar filled (top results) | `2883:9124` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-9124&m=dev |

## Composition (see [[components]])
Same shell as [[live-tv-epg]]: `navbar` · `search-bar` · `channel-category-tabs` ·
`featured-live-program` · `on-air-today-schedule` · `live-channels-sidebar` · `footer`.
Each category is a filtered state of `channel-category-tabs`.

## Implementation notes
- Built 2026-07-15 as [ChannelCategoryTabs](../../src/components/sections/liveTv/ChannelCategoryTabs.jsx) — one shared shell with [[live-tv-epg]], each category a filtered state rather than a separate screen (matches the Composition note above).
- ~~Only the **Sport** category has real fixture data~~ 🪦 **Superseded 2026-07-17 (evening rebuild):** category renamed **"Sports"** (plural, per the user's reference screenshot), and every schedule row + live-channel card in [liveTvFixtures.js](../../src/data/liveTvFixtures.js) now carries a real `category`, so all five chips genuinely filter (verified: Kids → 1 Replay + 2 live cards + 1 Remind). The empty-state message only appears when a category/tab combination truly has nothing.
- `?category=` round-trips through the URL 2026-07-16 (`useSearchParams`, replace-not-push); "All" omits the param rather than writing `?category=All`. Note the URL value is now `?category=Sports`.
