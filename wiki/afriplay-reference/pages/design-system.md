# Design System

> Source of truth for tokens. Distilled from [[figma-frames]] (raw). Tags: see [[CLAUDE]].
> Token values pulled from **Figma variables** (file `VEIpoe6WtZjzxqzFSN5Agt`) via the Figma MCP
> `get_variable_defs` on 2026-06-04. Spacing & radius had **no variables** → read from frame nodes
> and marked `⚠️ NODE-INFERRED`. Gaps/inconsistencies live in [[open-questions]] (#10–#15).

## Where the tokens live

`✅ VERIFIED` (build passes). Tokens are a single Tailwind v4 `@theme` block in
[src/App.css](../../src/App.css) — **mirroring Elysium Tours' structure** (one CSS-custom-property
file; Tailwind v4 auto-generates `bg-*`, `text-*`, `rounded-*`, `shadow-*` utilities from each var).
Components consume them as Tailwind classes (e.g. `bg-prim-gold`, `text-h3`, `rounded-lg`,
`shadow-card-md`). Scaffold: Vite + React + Tailwind v4 at repo root (`npm run build` → `build/`).

**Naming note vs Elysium:** Elysium uses `--color-secondary-normal-default` (semantic light/normal/dark).
AfriPlay's Figma uses its own scheme (`primary/gold-N`, `background/purple-N`, `neutrals/neutral-gray-N`).
We kept the Figma names (slashes → dashes) so they round-trip with Figma, inside Elysium's
`--color-*` / `--text-*` / `--radius-*` / `--gap-*` grammar. Elysium had no line-heights; AfriPlay's
Figma does, so type tokens add `--text-{n}--line-height`.

| Token group | Figma node | Source | Link |
|-------------|-----------|--------|------|
| Color | `2026:8103` | Variables | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2026-8103&m=dev |
| Typography | `2089:10423` | Variables | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2089-10423&m=dev |
| Spacing Scale | `2091:11155` | ⚠️ node-inferred (no vars) | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2091-11155&m=dev |
| Shadow Elevation | `2091:11962` | Variables (effects) | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2091-11962&m=dev |
| Border Radius | `2105:4097` | ⚠️ node-inferred (no vars) | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2105-4097&m=dev |

## Colors `✅ VERIFIED` (from variables)

AfriPlay is a **gold-on-dark-purple** product. `--color-surface-purple` is the app background;
`--color-prim-gold` is the brand accent.

### Brand (semantic)
| Token | Value | Figma var | Used for |
|-------|-------|-----------|----------|
| `--color-prim-gold` | `#c2b801` | `prim-gold` | Primary brand accent (CTAs, highlights, logo) |
| `--color-prim-gold-highlight` | `#d4c901` | `prim-gold-highlight` | Hover/active accent |
| `--color-surface-purple` | `#1f0832` | `surface-purple` | App background (set on `body`) |
| `--color-elevated-surface` | `#3e1151` | `elevated-surface` | Raised surfaces (cards, sheets) |
| `--color-tertiary` | `#ffffff` | `tertiary` | Pure-white text/icons on dark |
| `--color-border` | `#02070526` | `Color Scheme 1/Border` | Hairline borders/dividers (alpha hex) |

### Primary / Gold ramp — `--color-primary-gold-{1..11}` (gold-7 missing, see [[open-questions]] #11)
| Step | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Value | `#fcfbe8` | `#f2f0cb` | `#e8e5ae` | `#dfda90` | `#d5cf70` | `#cbc34b` | — | `#a39c02` | `#858001` | `#686601` | `#4d4c00` |

### Purple ramp — `--color-purple-{1..11}` (Figma `background/purple-N`)
| Step | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Value | `#f3ecf9` | `#efe5f7` | `#e3d1f2` | `#d0aeeb` | `#b57ae3` | `#9839df` | `#7816be` | `#580c8d` | `#400668` | `#320451` | `#2d034a` |

### Neutral / Gray ramp — `--color-gray-{1..11}` (Figma `neutrals/neutral-gray-N`)
| Step | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Value | `#ffffff` | `#f5f5f5` | `#ededed` | `#e0e0e0` | `#c2c2c2` | `#9e9e9e` | `#757575` | `#616161` | `#404040` | `#0a0a0a` | `#18171c` |

### Status ramps — `--color-{success|error|warning}-{1..11}`
| Step | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| success | `#ecf9f1` | `#cff2dc` | `#b2eac5` | `#94e1ae` | `#76d895` | `#53cf7b` | `#22c55e` | `#18a44e` | `#0f843f` | `#086630` | `#044921` |
| error | `#fffbfa` | `#fef3f2` | `#fee4e2` | `#fecdca` | `#fda29b` | `#f97066` | `#f04438` | `#d92d20` | `#b42318` | `#912018` | `#7a271a` |
| warning | `#fffcf5` | `#fffaeb` | `#fef0c7` | `#fedf89` | `#fec84b` | `#fdb022` | `#f79009` | `#dc6803` | `#b54708` | `#93370d` | `#7a2e0e` |

Step `7` is the base/solid tone of each status ramp (e.g. `success-7 #22c55e`).

## Typography `✅ VERIFIED` (from variables)

Font family: `--font-primary` = **`SF Pro Text`** (Figma `font-family/primary`) with system fallback.
⚠️ SF Pro is an Apple system font, not on Google Fonts — webfont licensing is [[open-questions]] #13.
Each size token has a paired `--text-{n}--line-height`. Weights: `--font-weight-regular 400`,
`-medium 500`, `-semibold 600`, `-bold 700`.

| Token | Size | Line-height | Figma var | Tailwind class |
|-------|------|-------------|-----------|----------------|
| `--text-h1` | 64px | 72px | `font-size/h1` | `text-h1` |
| `--text-h2` | 56px | 64px | `font-size/h2` | `text-h2` |
| `--text-h3` | 48px | 56px | `font-size/h3` | `text-h3` |
| `--text-h4` | 40px | 48px | `font-size/h4` | `text-h4` |
| `--text-h5` | 36px | 44px | `font-size/h5` | `text-h5` |
| `--text-h6` | 30px | 38px | `font-size/h6` | `text-h6` |
| `--text-5xl` | 28px | 36px | `font-size/5xl` | `text-5xl` |
| `--text-4xl` | 24px | 32px | `font-size/4xl` | `text-4xl` |
| `--text-3xl` | 22px | 30px | `font-size/3xl` | `text-3xl` |
| `--text-2xl` | 20px | 28px | `font-size/2xl` | `text-2xl` |
| `--text-xl` | 18px | 26px | `font-size/xl` | `text-xl` |
| `--text-lg` | 16px | 24px | `font-size/lg` | `text-lg` |
| `--text-base` | 14px | 22px | `font-size/base` | `text-base` |
| `--text-sm` | 12px | 18px | `font-size/sm` | `text-sm` |
| `--text-xs` | 10px | 16px | `font-size/xs` | `text-xs` |
| `--text-2xs` | 8px | 12px | ⚠️ hardcoded (no var) | `text-2xs` |
| `--text-3xs` | 7px | 12px | ⚠️ hardcoded (no var) | `text-3xs` |
| `--text-4xs` | 6px | 10px | ⚠️ hardcoded (no var) | `text-4xs` |

## Spacing `⚠️ NODE-INFERRED` (no Figma variables — read from frame 2091:11155)

8-point grid (4px for micro-adjustments). Token name = px ÷ 4 (matches the Figma "Name" column).
Figma **skips names 9 (36px) and 11 (44px)** — see [[open-questions]] #12. Consumed as `gap-*`,
`p-*`, `m-*` etc. via Tailwind.

| Token | Value | Token | Value | Token | Value |
|-------|-------|-------|-------|-------|-------|
| `--gap-1` | 4px | `--gap-5` | 20px | `--gap-10` | 40px |
| `--gap-2` | 8px | `--gap-6` | 24px | `--gap-12` | 48px |
| `--gap-3` | 12px | `--gap-7` | 28px | `--gap-13` | 52px |
| `--gap-4` | 16px | `--gap-8` | 32px | | |

## Border Radius `⚠️ NODE-INFERRED` (no Figma variables — read from frame 2105:4097)

| Token | Value | Figma label | Used for |
|-------|-------|-------------|----------|
| `--radius-xs` | 3px | Radius/XS | Small inner elements |
| `--radius-sm` | 5px | Radius/SM ("Primary Radius") | Default / primary radius |
| `--radius-md` | 8px | Radius/MD | Cards, inputs |
| `--radius-lg` | 12px | Radius/LG | Large cards/containers |
| `--radius-xl` | 16px | Radius/XL | Hero/feature panels |
| `--radius-full` | 9999px | Radius/FULL | Pills, avatars, circular |

Ordering oddity (XS=3 < SM=5, "Primary" sits mid-scale) flagged in [[open-questions]] #14.

## Elevation / Shadow `✅ VERIFIED` (from effect variables)

8-digit hex = `#RRGGBBAA`. Gold/active glows use the brand gold `#c2b801` at varying alpha.

| Token | Value | Figma var | Used for |
|-------|-------|-----------|----------|
| `--shadow-card-sm` | `0 2px 3px -3px #00000040` | `card-shadow/sm` | Subtle card lift |
| `--shadow-card-md` | `0 5px 10px 11px #0000001a` | `card-shadow/md` | Standard card |
| `--shadow-card-lg` | `0 8px 12.9px 14px #00000024` | `card-shadow/lg` | Modal / large card |
| `--shadow-gold-glow-sm` | `0 0 15px 0 #c2b80120` | `gold-glow/sm` | Faint gold halo |
| `--shadow-gold-glow-md` | `0 0 15px 0 #c2b80133` | `gold-glow/md` | Gold halo (hover) |
| `--shadow-gold-glow-lg` | `0 0 16.1px 2px #c2b80133` | `gold-glow/lg` | Strong gold halo |
| `--shadow-active-glow-sm` | `0 0 16px 0 #c2b8015c` | `active-glow/sm` | Active/selected, subtle |
| `--shadow-active-glow-md` | `0 0 30px 0 #c2b80166` | `active-glow/md` | Active/selected |
| `--shadow-active-glow-lg` | `0 0 30px 0 #c2b80199` | `active-glow/lg` | Active/selected, strong |

## Iconography
`❓` — Icon set & sizing not yet extracted (frame `2094:8019`). Pending.

## Breakpoints
`❓` — No breakpoint variables in Figma.
🪦 ~~all frames are Desktop 1728px~~ — **stale as of 2026-06-05**: the sheet now includes **Mobile**
frames (Home, Video Playing, Search) — see [[figma-frames]] append log + [[open-questions]] #2.
A mobile width/breakpoint still isn't expressed as a token; relying on Tailwind defaults until the
responsive strategy is confirmed.

Reference viewport: **Desktop 1728px** for desktop frames; **Mobile** frames added 2026-06-05
(width TBC from the mobile hero/top-app-bar nodes).
