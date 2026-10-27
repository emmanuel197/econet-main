# AfriPlay Ghana Wiki — Index

> Living knowledge base for the AfriPlay Ghana platform revamp. Maintained by Claude Code.
> **Read this file first. Pick the 2–3 relevant pages. Load only those.** Never load the whole wiki.
> Rules & confidence tags: [CLAUDE.md](CLAUDE.md). Karpathy wiki pattern.

## Confidence tags (quick ref)
`✅ VERIFIED` · `🔶 LIKELY` · `❓ NEEDS-CLARIFICATION` · `⚠️ ASSUMPTION` · `🪦 STALE` · `🔗 EXTERNAL`
Full meanings in [CLAUDE.md](CLAUDE.md).

## Start here
- [CLAUDE.md](CLAUDE.md) — wiki rules: how to ingest, answer, lint. Read once.
- [pages/conventions.md](pages/conventions.md) — stack, naming, Figma workflow, commit gate.
- [pages/debugging-workflow.md](pages/debugging-workflow.md) — console-log convention + Playwright MCP verification loop (Mango pattern; server registered 2026-07-28).
- [pages/open-questions.md](pages/open-questions.md) — unresolved decisions (stack, routes, mobile, auth).

## Screens (one page per design group)
- [pages/home.md](pages/home.md) — Home: hero + content rails + video-playing states.
- [pages/shorts-reels.md](pages/shorts-reels.md) — Shorts/Reels feed grid + player, desktop. `✅ VERIFIED` (rebuilt 2026-07-16; prior page's mobile-build claim was stale, see page).
- [pages/shorts-comments.md](pages/shorts-comments.md) — 🪦 REMOVED 2026-06-05 (comment drawer deleted from design; tombstoned).
- [pages/search.md](pages/search.md) — Search landing, recent searches, autocomplete. `✅ VERIFIED` (built 2026-07-15).
- [pages/search-results.md](pages/search-results.md) — Results tabs (all/movies/shows/channels) + skeleton. `✅ VERIFIED` (built 2026-07-15).
- [pages/search-edge-cases.md](pages/search-edge-cases.md) — Short query, in-progress, zero results, network error, toast. `✅ VERIFIED` (built 2026-07-15).
- [pages/live-tv-epg.md](pages/live-tv-epg.md) — Live TV / EPG channel list + schedule (Coming Up / Earlier Today). `✅ VERIFIED` (built 2026-07-15).
- [pages/live-tv-filters.md](pages/live-tv-filters.md) — EPG category filters: Sport, News, Entertainment, Movies, Kids. `✅ VERIFIED` (built 2026-07-15).

## Cross-cutting
- [pages/design-system.md](pages/design-system.md) — color, type, spacing, elevation, radius, icons (tokens source of truth).
- [pages/components.md](pages/components.md) — catalog of recurring macro-components and which screens use them.
- [pages/api-contract.md](pages/api-contract.md) — endpoints & data→UI mapping + integration map (brief-over-legacy precedence). `✅ VERIFIED` (live-probed 2026-07-17).

## Raw (immutable sources)
- [raw/figma-frames.md](raw/figma-frames.md) — verbatim Figma sheet: 69 screen frames + 199 component frames → node links (Mobile added 2026-06-05, see append log).
- [raw/api-docs.md](raw/api-docs.md) — verbatim API brief email (operators, base URLs, endpoint catalogue). Distilled into api-contract.

## Sessions (working-session summaries — patterns for future sessions)
- [sessions/2026-07-17-auth-subscriptions-api-integration.md](sessions/2026-07-17-auth-subscriptions-api-integration.md) — auth port, subscriptions, navbar redesign, content-API integration. **Read this before touching API code**: live-verified endpoint quirks (profile_id, packages params, response nesting, HLS trailers, image-id URLs), user working agreements (brief-over-legacy, legacy-logic/revamp-UI), dev flags, gh-push pattern, open Monday questions.

## Operations
- [log.md](log.md) — chronological record of wiki updates.

---
*Last updated: 2026-07-20 · 8 screen pages, 3 cross-cutting, 1 raw source. Shorts/Reels (feed + player), Search, and Live TV/EPG desktop built ✅. No screen has a verified mobile build — [[shorts-reels]]'s prior mobile claim was stale. Index budget: keep < ~3k tokens.*
