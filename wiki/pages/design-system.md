# Design system

> Source: Figma file `Oq63PfKhvBDbPc9wBqYa2K` ("econetzwwonawebclient 2"), page **All pages (developers)** `4041:1094`.
> Code: `src/styles/global.css` (`@theme static` block). `✅ VERIFIED` 2026-10-26 by counting visible nodes on that page.

## How the values were obtained
- The file has **no published colour/text styles or readable variables** (Variables REST API needs Enterprise; styles endpoint 403 with the current token scopes). `🔗 EXTERNAL`
- Values were tallied from every *visible* node's fills/strokes/text styles on the developers page (1,575 hidden subtrees skipped), then checked against renders of the desktop homepage `4041:21538` and the mobile homepage `4041:1130`.
- iOS keyboard mockups (`SF Compact 457 / 25px`, `Key`, `Keyboard` instances) are device chrome, not app UI — ignored.

## Colours

| Token | Value | Use (count of visible nodes) |
|---|---|---|
| `brand` | `#da1375` | Primary pink: buttons, active nav, NEW badge, progress, borders (239 fills, 161 text, ~450 strokes) |
| `brand-light` | `#e83a8e` | Lighter pink variant (41) — hover |
| `brand-dark` | `#6e093b` | End of the brand button gradient |
| `page` | `#0e152c` | Page background (all desktop/mobile frames) |
| `surface` | `#0f1a3e` | Deep panels (24) |
| `surface-raised` | `#1a2548` | Cards/panels (40), start of surface gradient |
| `text-soft` | `#d6dbed` | Secondary text (180) |
| `text-muted` | `#9999b2` | Tertiary text (at 65–75% opacity, 60) |
| `live` | `#ff0e10` | LIVE dot, notification dot (45) |
| `error` | `#b42318` | Error states (127); gradient variant `#d92d20 → #731811` |

White at varying opacity carries most text and borders (`#fff` 1,557 text nodes; `/60`, `/70`, `/75`, `/80` common; borders `white/10`, `white/30`). Use Tailwind opacity modifiers (`text-white/70`, `border-white/10`) rather than new tokens.

Not yet assigned (`❓`): `#333333` (360 fills), `#595959` (348 text), `#9e9e9e`, `#cccccc` — likely the light search bar / skeleton states; assign when those screens are built.

## Gradients (`:root` CSS variables)
- `--gradient-brand`: `#da1375 → #da1375 → #6e093b` (216) — Watch Now button.
- `--gradient-surface`: `#1a2548 → #0e152c` (262).
- `--gradient-scrim`: transparent → black (257) — over hero/poster images.
- Ambient background blobs: angular `#3d4971 → #b0186a @30%` with layer blur 100–200 (654 nodes). Build as blurred radial blobs behind the page (AfriPlay had a shared "ambient blob field" for this).
- Also seen: pink glow `#ff85a7 @90% → @5%` (216), `#83798c → #4b62ae` (62).

## Typography
- Family: **SF Pro / SF Pro Text** everywhere (Inter in 66 nodes only). SF Pro is Apple's system font and can't be served as a web font → stack `"SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (same decision as AfriPlay). Windows renders Segoe UI.
- Figma weights 510 / 590 / 860 are SF variable weights → map to CSS 500 / 600 / 800.
- Most-used sizes (px, weight): 15/400, 16/400, 18/400, 18/590, 14/510, 24/700, 13/590, 11/400, 12/400, 20/590, 28/590. Line heights mostly ~1.2–1.5; letter-spacing −0.5…−0.4 px on 11–18 px text.
- A type scale will be fixed when the first real screen (navbar/home) is built.

## Radii and effects
- Radii: `100`/`1000` = pill (buttons, chips, avatars); `16` cards; `5`, `8.5`, `10`, `20`, `24` also common.
- Effects: heavy blur (layer blur 100/200 for blobs; background blur 50/100 = frosted glass on nav/buttons); one soft drop shadow `0 0 10 #000/10`.

## Frame widths
Desktop **1728** px, mobile **393** px (one mobile home at 390). Same as AfriPlay — see [[known-pitfalls]] "Layout" before choosing a scaling approach.

## Assets
- Logo: `src/assets/brand/wona-logo.svg`, exported from nav-bar logo instance `I4041:21741;6040:23408` (120×28, text outlined).
