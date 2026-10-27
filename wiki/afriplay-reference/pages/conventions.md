# Conventions

> Project conventions. Tags: see [[CLAUDE]]. Status: `⚠️ ASSUMPTION` until the stack lands —
> the repo is currently empty (only `.git`). Confirm and re-tag `✅ VERIFIED` once code exists.

## Stack
`❓ NEEDS-CLARIFICATION` — framework not yet chosen/cloned. (MangoTV precedent: React + Redux + SCSS.)

## Confidence-tag legend
See [[CLAUDE]] for the full table: `✅ VERIFIED` · `🔶 LIKELY` · `❓ NEEDS-CLARIFICATION` ·
`⚠️ ASSUMPTION` · `🪦 STALE` · `🔗 EXTERNAL`.

## Naming
- Wiki pages: kebab-case, no `.md` in `[[backlinks]]`.
- Figma components are kebab-case (e.g. `live-reel-preview-card`); decide code casing here once set.
- **Components/pages:** PascalCase files (Elysium pattern) — `PosterCard.jsx`, `HomePage.jsx`. Folders kebab-case.
- **State/API (MangoTV pattern) `🔶 LIKELY`:** per content type, two files —
  `src/api/{contentType}.js` (async fns that dispatch slice actions; business logic) +
  `src/store/slice/{contentType}Slice.js` (state + `fetchXBegin/Success/Error` reducers, no `createAsyncThunk`).
  Pilot uses `home` (`api/home.js` + `homeSlice.js`); extend as `search.js`/`searchSlice.js`,
  `movies.js`/`moviesSlice.js`, `channels.js`/`channelsSlice.js`, etc. Store wired in `src/store/store.js`.

## Figma workflow
1. Find the frame in [[figma-frames]] or the screen page.
2. Call Figma MCP `get_design_context` with the **colon** node ID (e.g. `2883:4087`).
3. Use `get_variable_defs` for tokens, `get_metadata` for child structure.
4. All current frames are **Desktop 1728px**. No mobile frames in the sheet yet → [[open-questions]].

## Commit / pre-commit
`❓` — define lint/build gate once tooling lands (MangoTV ran lint+build before each commit).

## How to extend this wiki
Follow [[CLAUDE]]: ingest → `raw/` (immutable) → distill into `pages/` → flag contradictions →
update [[index]] → add a [[log]] line.
