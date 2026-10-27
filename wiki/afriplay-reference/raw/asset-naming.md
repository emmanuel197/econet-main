# RAW — Asset Naming Convention & Pipeline

> Source of truth for how assets are named, foldered, and converted. Tags: see [[CLAUDE]].
> Status: `✅ VERIFIED` — enforced by `scripts/process-assets.mjs`. See also [/assets/README.md](../../assets/README.md).
> Created 2026-06-04 to fix the Figma asset inconsistency problem (cropped/guessed vectors,
> ad-hoc names). Every developer's Claude Code reads `./assets/...` directly — never re-guesses from Figma.

## Folder structure (4 buckets)

```
assets/
├── icons/          UI glyphs — optimized SVG (close, play, like, search …)
├── illustrations/  decorative vectors + raster glows/ellipses (empty states, background glow)
├── logos/          brand/channel marks (raster → WebP lossless; flagged for vector replacement)
└── images/         photographic: posters, card art, hero/backgrounds — WebP q82
```

Source assets are downloaded organized as `screen/section/{png,svg}/file`. The pipeline flattens
them into the four buckets above; the **screen + section** is folded into the filename so each
name is globally unambiguous.

## Naming convention

`<screen>-<section>-<role>[-<variant>].<ext>` — kebab-case, lowercase, ascii.

- **screen** — short slug: `home`, `search`, `shorts-feed`, `shorts-play`, `comments`, `epg`,
  `search-edge`, `results`.
- **section** — the component/section the asset belongs to (`hero`, `reel-player`, `recommended`…).
- **role** — what the asset is (`bg`, `poster-17`, `card-04-baby-driver`, `fullscreen`, `like`).
- Noise tokens dropped automatically: `section`, `desktop`, `1728px`, `png`, `svg`, `icon`.
- Adjacent and repeated tokens are collapsed, so names stay short (e.g. `home-hero-bg.webp`).

Examples:
| Source | Bucket | Result |
|--------|--------|--------|
| `home-screens-desktop-1728px/hero/png/hero-bg.png` | images | `images/home-hero-bg.webp` |
| `comment-section-desktop/reel-player/svg/play-center-icon.svg` | icons | `icons/comments-reel-player-play-center.svg` |
| `ep-filter-desktop/sport/featured-live-program/png/channel-logo-supersport.png` | logos | `logos/epg-sport-featured-live-program-channel-supersport.webp` |

## Conversion rule (SVG vs WebP)

| Source kind | Output | How |
|-------------|--------|-----|
| True vector (icons, line art, logos exported as SVG) | **SVG** | svgo, `multipass`, **viewBox preserved**, width/height stripped (`removeDimensions`) |
| Photographic / many-layered raster | **WebP q82 (lossy)** | sharp |
| Raster logos & soft-gradient glows/ellipses | **WebP lossless** | sharp `lossless:true` (preserves alpha & flat edges) |

**Never ship a cropped SVG.** If svgo output loses its `viewBox`, the pipeline keeps the original
file instead and flags it. WebP output dims are validated against the source PNG; any mismatch is flagged.

**Flagged for human review (not auto-resolved):**
- `logos/*` derived from raster PNG — replace with real vector if the brand provides one.
- Glow/ellipse illustrations — confirm alpha looks right at q-lossless.

## Icon dedup

Byte-identical SVG icons that repeat across screens are collapsed to one canonical file (matched by
content hash, tracked in `assets/.asset-manifest.json`). Same-name-but-different-content icons are
suffixed `-2`, `-3` and flagged rather than silently overwritten.

## Git LFS

Heavy binaries (`*.png *.jpg *.jpeg *.webp *.gif *.pdf`) are tracked by Git LFS (see root
`.gitattributes`). **SVGs are NOT in LFS** — all are <3KB and kept as normal diffable git text.
Cutoff to promote an SVG to LFS: **20KB**. After cloning: `git lfs pull`.

## Running the pipeline

```
node scripts/process-assets.mjs <screen-folder-name> [--dry]
```
Processes one screen (batch) at a time, prints an old→new mapping table + flags. `--dry` previews
without writing. Source root is hardcoded to the downloads folder in the script.
