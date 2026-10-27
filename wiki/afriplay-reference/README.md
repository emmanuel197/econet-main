# AfriPlay Ghana — Wiki

A persistent, compounding knowledge base for the AfriPlay Ghana platform revamp. Plain markdown,
Obsidian-style `[[backlinks]]`, no database or RAG tooling. It exists so **no Claude Code session
rediscovers project context from scratch.**

## For developers

1. **Clone the repo** (you already have it if you're reading this).
2. **At the start of every Claude Code session, point it at the wiki index:**

   ```
   Read wiki/index.md before doing anything. Load only the 2–3 pages relevant to this task.
   ```

   `index.md` is the hub — it lists every page with a one-line description. Your agent picks the
   relevant pages and loads only those, keeping context cheap.

3. The rules your agent follows live in [`wiki/CLAUDE.md`](CLAUDE.md). The short version:
   - Read `index.md` first; never load the whole wiki.
   - Update pages incrementally as you learn.
   - When a source contradicts a page, **flag it inline** (`🪦 STALE` + new claim) — don't overwrite.

## Layout

```
wiki/
├── index.md         ← navigation hub. READ FIRST.
├── CLAUDE.md        ← rules & confidence-tag schema for agents.
├── README.md        ← this file (for humans).
├── log.md           ← chronological update record.
├── raw/             ← immutable source material (append-only). Figma sheet, API docs, briefs.
└── pages/           ← maintained knowledge: one page per screen + design-system, components,
                       api-contract, conventions, open-questions.
```

## Adding to the wiki

Paste a new source (API docs, the WhatsApp brief, design notes) and ask your agent to ingest it.
It will drop the verbatim copy into `raw/` (never edited after) and distil it into the right
`pages/` file, following `CLAUDE.md`.
