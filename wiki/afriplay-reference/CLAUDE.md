# Wiki Schema & Rules — read this once, then read `index.md`

This is the operating manual for the **AfriPlay Ghana wiki** — a persistent, compounding
knowledge base maintained by Claude Code, following the
[Karpathy Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).
Every developer's Claude Code session reads from it **before** doing any work, so no session
rediscovers project context from scratch.

## The three rules (non-negotiable)

1. **Read `index.md` first. Never load the whole wiki.** `index.md` is the hub: pick the 2–3
   pages relevant to your task and load only those. Loading everything defeats the purpose and
   burns context.
2. **Update pages incrementally.** When you learn something, append or refine the relevant page.
   Do not rewrite a page wholesale unless it is genuinely obsolete.
3. **When a source contradicts an existing page, flag it inline — do not silently overwrite.**
   Mark the old claim `🪦 STALE` and add the new one beside it with its source and date. Humans
   resolve contradictions; you surface them.

## Three layers

| Layer | Path | Who writes it | Editable? |
|-------|------|---------------|-----------|
| **raw** | `/wiki/raw/` | Ingested verbatim from a source | **Immutable.** Append-only, never edit landed content. |
| **pages** | `/wiki/pages/` | Claude Code, distilled & maintained | Yes — incrementally. |
| **hub** | `/wiki/index.md` | Claude Code | Yes — keep under ~3k tokens. |

`raw/` is the immutable source of truth (the Figma sheet dump, pasted briefs, API docs).
`pages/` is your distilled, opinionated working knowledge. When the two disagree, `raw/` wins on
*facts*, `pages/` wins on *interpretation* — and you flag the gap.

## Confidence tags (put one on every non-trivial claim)

| Tag | Meaning |
|-----|---------|
| `✅ VERIFIED` | Confirmed by reading current source code or an authoritative source |
| `🔶 LIKELY` | Inferred from patterns or adjacent evidence, not directly confirmed |
| `❓ NEEDS-CLARIFICATION` | Ambiguous — needs a human decision. Also log it in `pages/open-questions.md` |
| `⚠️ ASSUMPTION` | Educated guess; flag so it can be checked |
| `🪦 STALE` | Was true once, now suspect — kept beside its replacement until a human confirms |
| `🔗 EXTERNAL` | Depends on an external system (Figma, the API, a brief) — verify before acting |

## How to ingest a new source

1. Drop the verbatim content into `/wiki/raw/<source>.md` with a header: source, date, status `🔗 EXTERNAL`.
2. **Never edit** that file afterward — only append a dated section if the source changes.
3. Distill the relevant facts into the appropriate `pages/` file(s), tagging confidence.
4. If it contradicts an existing page, follow rule 3 (flag, don't overwrite).
5. Add a one-line entry to `pages/` index if a new page was created, and a dated line to `log.md`.

## How to answer a query (the loop)

1. Read `index.md`.
2. Pick the 2–3 relevant pages from the descriptions.
3. Load only those. Follow `[[backlinks]]` if you need a neighbour.
4. If the answer is `❓` or absent, check `raw/` and `open-questions.md` before guessing.
5. After acting, update the page(s) you touched and add a `log.md` line.

## How to lint the wiki

- `index.md` lists **every** file in `pages/` (and the raw dump) — no orphans.
- Every `pages/` file has a confidence tag legend reference and at least one `[[backlink]]`.
- No claim older than its source without a `🪦 STALE` re-check.
- `index.md` stays under ~3k tokens. If `pages/` collectively exceeds ~200k tokens, **propose a
  hierarchical split** (sub-indexes per domain) rather than stuffing context — do not silently grow.

## Conventions

- **Plain markdown only.** No database, no embeddings, no RAG tooling. Files + Obsidian-style
  `[[page-name]]` backlinks (omit the `.md`).
- Convert relative dates to absolute (`today` → `2026-06-04`).
- Screen pages link to their Figma node(s) via `raw/figma-frames.md` — the node map is the
  single source for frame→node mapping.

> Schema version 1 — 2026-06-04. See [[conventions]] for code/naming rules and [[index]] for the page list.
