# Screen — Live TV / EPG

> Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — rebuilt 2026-07-17 (evening) against five user-supplied reference
> screenshots of the real design. Category filters in [[live-tv-filters]].

> **2026-07-17 — Featured hero restructured.** The only shipped EPG image
> (`epg-sport-featured-live-program-match-graphic.webp`) is a square **3×3 collage of rounded
> tiles** with transparent gutters — not a full-bleed hero photo. It was being stretched
> `object-cover` behind the hero text, which looked broken (stray card edges, text landing in
> gutters — user's "messy" report, root-caused by Reading the asset file directly).
> `FeaturedLiveProgram` renders a dark gradient card with the collage `object-contain` on
> the right and the text panel on the left. `⚠️` If a real full-bleed hero export ships, swap
> back to a cover layout.

**Sheet group:** EP first user story · **Route:** `/live` `✅ VERIFIED` (registered in App.jsx 2026-07-15)

## Figma frames
| State | Node | Link |
|-------|------|------|
| Home Screens (entry) | `2883:5318` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-5318&m=dev |
| EPG-01 Live TV & Channel List | `2883:5671` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-5671&m=dev |
| EPG-01 — Coming Up | `2883:6571` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-6571&m=dev |
| EPG-01 — Earlier Today | `2883:7076` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-7076&m=dev |
| Home Screens (alt) | `2883:7599` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-7599&m=dev |

## Composition (see [[components]])
`navbar` · `search-bar` · `channel-category-tabs` · `featured-live-program` ·
`on-air-today-schedule` · `live-channels-sidebar` · `footer`

## Notes
- "All" / "Earlier Today" / "Coming Up" are underline tabs on one schedule component; the
  All tab is chronological: Earlier rows (Replay) → live-now channel cards → Coming Up rows
  (Remind).

## Implementation notes (rebuilt 2026-07-17 evening, per user reference screenshots)
- [LiveTvPage](../../src/pages/LiveTvPage.jsx): **full-width search bar at top (no page h1)**
  → category chips (**"Sports"** plural now, was "Sport") → main column (hero + On Air Today)
  + right sidebar.
- [FeaturedLiveProgram](../../src/components/sections/liveTv/FeaturedLiveProgram.jsx): LIVE
  badge + "124.5K watching" · SuperSport logo (`epg-...-channel-logo-supersport.webp`) +
  "SuperSport · Ch 5" · two-line title ("AFCON 2024 Semifinal" white / "Nigeria vs Cameroon"
  gold) · flags + **2 – 1 score with red 67' minute pill** · start/remaining/end times over a
  gold progress bar · gold "▶ Watch Now" + secondary "≡ Full Guide"
  (`epg-...-full-guide-menu.svg`). Collage contained on the right (see hero note above).
- [LiveChannelCard](../../src/components/cards/LiveChannelCard.jsx) — rewritten as the rich
  EPG card (logo · channel + category chip · LIVE + show title · "Next: … · time" · bell ·
  gold progress bar; gold border when active). Used by BOTH the sidebar and the schedule's
  live segment. Alternating rows get a subtle bg.
- [OnAirScheduleSection](../../src/components/sections/liveTv/OnAirScheduleSection.jsx):
  header "On Air Today" + fixture date ("Thursday, 30 April 2026") · underline tabs
  All/Earlier Today/Coming Up · rows = time | logo | category chip + title + channel |
  gold **⟳ Replay** (earlier) or **🔔 Remind** (upcoming) pill. Icon assets are white-stroke
  SVGs, rendered dark on the gold pills via `brightness-0`.
- [LiveChannelsSidebar](../../src/components/sections/liveTv/LiveChannelsSidebar.jsx):
  "All Live Channels" + count pill (25, fixture `liveChannelsTotal`) + "See All →".
- Search bar **now filters** the live-channel cards (sidebar + schedule live segment) by
  channel/show name — was cosmetic before.
- Category chips filter schedule rows AND live cards by their real `category` field (every
  fixture row is categorised now — previously only Sport had data and other chips showed an
  empty message). Verified: Kids → 1 Replay + 2 live cards + 1 Remind. `?category=` still
  round-trips the URL — see [[live-tv-filters]].
- Asset coverage still thin: only SuperSport has a real channel logo
  (`epg-sport-featured-live-program-channel-logo-supersport.webp`); every other channel logo
  reuses Home's `browse-live-channels-*` card images as placeholders (`⚠️ ASSUMPTION`) —
  the reference shows real Arise/Disney/BET/Gh One/Telemundo/KTN logos that never shipped.
- Data: [liveTvFixtures.js](../../src/data/liveTvFixtures.js) (rewritten to the reference
  copy). No `/api/liveTv` yet ([api/liveTv.js](../../src/api/liveTv.js) is a flagged stub).
