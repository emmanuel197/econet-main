# AfriPlay Assets

Pre-exported, version-controlled UI assets. **Reference these local files directly** (e.g.
`./assets/images/home-hero-backdrop-stranger-things.webp`) — never re-export or guess from Figma.
The Figma Dev-Mode MCP crops vectors to path bounds and loses frame padding, so everything was
exported **once** into this folder to give every developer stable, correct paths.

## Pull the binaries after cloning

Heavy assets are stored in **Git LFS** (kept out of normal git history so clones stay small).
A fresh clone gets lightweight pointer files; download the real binaries with:

```bash
git lfs install     # one-time, per machine
git lfs pull        # download the actual png/webp/etc. for the current checkout
```

If you cloned before installing LFS, run both commands above. Verify with `git lfs ls-files`.

## Folder structure

```
assets/
├── icons/          UI glyphs — optimized SVG (normal git, <3KB each, diffable)
├── illustrations/  decorative vectors + raster glows/ellipses (empty states, background glow)
├── logos/          brand/channel marks (WebP lossless — flagged for vector replacement)
└── images/         photographic: posters, card art, hero/backgrounds (WebP q82)
```

## Naming convention

`<screen>-<section>-<role>[-<variant>].<ext>` — kebab-case, lowercase. The screen + section is
folded into the filename so each name is globally unambiguous after flattening, e.g.
`home-hero-backdrop-stranger-things.webp`, `comments-reel-player-play-center.svg`.
Full spec: [/wiki/raw/asset-naming.md](../wiki/raw/asset-naming.md).

## SVG vs WebP rule

| Source | Output | Why |
|--------|--------|-----|
| True vector (icons, line art) | **SVG** via svgo, **viewBox preserved**, width/height stripped | crisp at any size, never cropped |
| Photographic / many-layered raster | **WebP q82 (lossy)** | ~80–95% smaller than PNG |
| Raster logos & soft-gradient glows | **WebP lossless** | preserves alpha & flat edges |

- **SVGs are NOT in LFS** (all <3 KB, kept as normal git text). LFS promotion cutoff: 20 KB.
- Byte-identical assets are **deduped** to one canonical file (tracked in `.asset-manifest.json`).

## Regenerating / adding assets

Drop new exports under the Downloads source folder in screen/section structure and run:

```bash
node scripts/process-assets.mjs <screen-folder-name>      # writes files + prints old→new mapping
node scripts/process-assets.mjs <screen-folder-name> --dry # preview only
```

Mappings are saved under `scripts/mappings/`. Review flags (cropped SVG, dim mismatch, raster logo)
before committing.

## Flagged for human review

- `logos/*` are derived from **raster** PNGs — replace with real vector if the brand provides SVGs.
- Glow/ellipse illustrations are lossless WebP — confirm alpha renders correctly on the dark purple surface.
