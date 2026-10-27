# Screen — Shorts / Reels (comment drawer states) 🪦 REMOVED

> 🪦 **STALE / REMOVED 2026-06-05.** The comment drawer + login-prompt designs were **deleted from
> Figma** (nodes below no longer exist) — confirmed live and recorded in the [[figma-frames]] append
> log (2026-06-05 (b)). The `comment` action was also removed from `reel-action-rail`. Kept as a
> tombstone per wiki rule 3; do not build these. Reel feed/player remain in [[shorts-reels]].
> If commenting returns, a human should un-tombstone this page.

**Sheet group:** ~~Comment Section - Desktop~~ (removed) · **Route:** n/a

## Figma frames
| State | Node | Link |
|-------|------|------|
| Comments populated | `2883:10373` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10373&m=dev |
| Empty (no comments) | `2883:10572` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10572&m=dev |
| Empty + login prompt | `2883:10732` | https://www.figma.com/design/VEIpoe6WtZjzxqzFSN5Agt/AfriPlay--Main-Deisgns-?node-id=2883-10732&m=dev |

## Composition (see [[components]])
`navbar` · `back-arrow` · `reel-info-card` · `reel-player` · `reel-action-rail` ·
`comment-drawer` / `comment-drawer-empty` · `login-prompt-modal` (login state) · `nav-arrows`

## Notes
- Login-prompt modal gates commenting for signed-out users — ties to auth flow `❓`.

## Implementation notes
_(empty)_
