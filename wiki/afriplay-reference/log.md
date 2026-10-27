# Wiki Update Log

Newest first. One line per change. See [[index]] / [[CLAUDE]].

## 2026-07-25 — Mobile top chrome sizing: status space, logo row, chips (increment 12)
- **Status-bar space reserved** (`MobileTopBar` app): added `pt-[60/390·mvw]` to the header —
  the OS status-bar area (comp 392×60; time/battery live there on-device, still not drawn by us
  per the earlier removal). NOTE: a `{/* */}` JSX comment right after `return (` is invalid (only
  valid inside JSX) — moved it to a `//` line above `return`.
- **Logo row → 390×32**: dropped the fixed h-56 + pt-12; the row now hugs to **32** tall
  (verified 390×32). Right-cluster buttons (Get Bundle / notification / avatar) resized 34→**32**
  to sit in the 32 row (Get Bundle height verified 32).
- **Filter chips → 168×25** (`MobileHero`): shrank padding/gap (px-8, py-6, gap-4, text-13) and
  moved to `top-[100/390·mvw]` to clear the now-92px top bar (60 status + 32 row). Verified group
  **168×25**, clears the bottom-anchored poster (chips bottom 120 < poster top 179).
- Verified at 375→390: status pt 60, logo row 390×32, Get Bundle 32, chips 168×25 @ top 100; no
  overflow; `npm run build` ✓.

## 2026-07-25 — Hero flat CTA buttons + 33px gap to rails (increment 11)
- **Hero CTA row** (`MobileHero`): flattened to the Figma sizes — **Watch Now 106×36** (h-36,
  removed the tall py; trimmed px/gap so it hugs ~107), **add button 36×36** (was 44), **4px gap**
  → row **146×36** (measured 147×36).
- **Gap between hero (poster+text) and the rails**: set to **33px**. Pulled the poster+text
  column to the hero's bottom edge (`bottom-0`, was `top-96`) and set the rails container top
  padding to `max-md:pt-[33/390·mvw]` (mobile only; desktop `py` unchanged) — so the only gap is
  the 33px. Verified: block bottom → first rail = exactly 33.
- Verified at 375→390: Watch Now 107×36, plus 36×36, row 147×36, gap 33; no overflow;
  `npm run build` ✓.

## 2026-07-25 — Logo 84×32 + hero poster/text block spacing (increment 10)
- **Mobile logo** (`MobileTopBar`): set to the Figma **84×32** frame — `h-[32/390·mvw]
  w-[84/390·mvw] object-fill` (object-fill continues the wordmark's wide look the old
  `scale-x-2` gave); dropped `scale-x-2`/`origin-left`/`w-auto`. Only rendered in the mobile app
  top bar (search/shorts/live use their own headers; desktop Navbar unchanged).
- **Hero poster + text spacing** (`MobileHero`): merged the (previously absolute) circular
  poster and bottom text into ONE centred flex column with a **12px gap** — derived from the
  Figma hug (poster 253 + gap 12 + text 215.88 = 480.88). Text block constrained to **176** wide.
- Verified at 375px→390 conversion: logo 84×32 exact; circle 253 wide; text area 176 wide ×
  ~219 tall (≈215.88); gap ~12; combined block ~486 (≈480.88); Watch Now+Add row 169 (fits the
  176 block); no overflow; `npm run build` ✓.

## 2026-07-25 — Search trending numerals + home hero circular poster (increment 9)
- **Top 5 Trending Searches numbers** (`MobileSearchPage`): restyled from a plain solid gold
  digit to the Figma's **outlined/hollow gold numeral** — transparent fill + `-webkit-text-stroke
  1.4px var(--color-prim-gold)`, `paintOrder: stroke`, ~28/390·mvw. Skeleton left unchanged (per
  user: it already matches Figma).
- **Home hero poster** (`MobileHero`): changed from a rounded-square card to a **circle** —
  `size-[253/390·mvw] rounded-full`, horizontally centred (was inset-x rounded-24 rectangle).
- Verified at 375px: numeral fill transparent + gold 1.4px stroke, font 27px; hero poster 243×243
  (=253 at 390), radius 9999px, centred; console clean; `npm run build` ✓.

## 2026-07-25 — Afrishorts feed: Trending/For You tile dims + overlaid titles (increment 8)
- **Trending Now tiles** (`MobileShortsPage`): resized to **110×130** (was 140-wide aspect-4/3)
  and the **title/views now overlay the poster** (bottom gradient scrim) instead of sitting below.
- **For You grid** rebuilt as a **2-column brick masonry** replacing the uniform grid. Tiles are
  full-column-width (flex-1 ≈ **172** on the 390 comp) and alternate height **200 (tall) / 145
  (short)** in a checkerboard: left column starts tall, right column starts short, each column
  alternates — so rows align at the top and both columns end level. Split via index parity
  (`i%2` → column) with `tall = j%2===0` (left) / `j%2===1` (right). New `ForYouTile` component;
  **title/views overlaid** on the poster (bottom scrim).
- Verified at 375px: Trending 106×125 (=110×130 at 390), titles overlaid; For You left col
  192/139/192/139, right col 139/192/139/192 (=200/145), width 166 (=172), rows aligned & columns
  end level, titles overlaid; no overflow; console clean; `npm run build` ✓.

## 2026-07-25 — Mobile home polish: hero, chips, status bar, top bar, rail peek (increment 7)
- **Hero (`MobileHero`)**: reworked to a blurred backdrop (`blur-2xl brightness-[0.45] scale-110`)
  behind a floating **rounded poster** (inset-x 52/390·mvw, rounded 24, sharp artwork + bottom
  scrim); play/pause now centres on the poster. Title/genres/buttons sit below the poster.
- **Chips**: left-aligned to the AfriPlay logo's gutter (pl 20/390·mvw); **only the active chip
  is a gold pill** — inactive chips are now plain text (removed the glass `border`/`bg-black/30`).
- **Faux device status bar removed** (time/wifi/battery): deleted `<MobileStatusBar/>` from
  `MobileTopBar`, `MainLayout` (status pages now render no top overlay), and `MobileShortsPlayer`.
  The `MobileStatusBar.jsx` file is now unused (left in place, dead).
- **Top bar (`MobileTopBar` app)**: logo left-spacing fixed — added `origin-left` so the
  `scale-x-2` wordmark stops overflowing left of its box (visible left now = row padding ≈ logo
  gutter, matches the chips); dropped the ad-hoc `ml-4`. **"Get Bundle" height = notification
  bubble** (both `h-[34/390·mvw]`; replaced the py with a fixed height).
- **Rail scroll affordance**: the desktop cards render at `--vw` (768 clamp) on mobile and some
  tiled flush to the edge (no peek). Bumped `PosterCard`/`ContinueCard`/`ChannelCard` mobile
  widths past the straddle threshold (`max-md:w-[186/390·mvw]`, aspect-matched heights) so the
  rightmost card always peeks past the right edge. Verified every home rail now has a straddling
  card (peek 16–110px); Genre/Short rails already peeked.
- Verified at 375px (DOM/rect): status-bar imgs 0; logo left 19 = first chip left 19; Get Bundle
  h 33 = notification h 33; inactive chip bg transparent + 0 border; blurred bg + rounded poster
  (275×317, r23) present; all rails peek; no overflow; console clean; `npm run build` ✓.

## 2026-07-24 — Mobile fixes: Shorts skeleton, double-tap like, Live TV category states (increment 6)
- **Shorts skeleton no longer flashes on every visit** (`MobileShortsPage`): the unconditional
  800ms mount timer was removed. `loading` now initialises from `isSlowConnection()` (Network
  Information API — `saveData` or `effectiveType` 2g/slow-2g); fast connections skip the skeleton
  entirely. `?loading=1` still forces it for the demo/slow-network state.
- **Double-tap like/unlike now works on touch** (`MobileShortsPlayer`): `onDoubleClick` doesn't
  fire on mobile, so taps are timed in `onTouchEnd` (`registerTap`, <300ms gap → toggle) via a
  shared `toggleLike` (burst only when it becomes liked); `onDoubleClick` kept for desktop mouse.
  Verified via synthetic touch: double-tap → gold+burst, double-tap → none; single/slow taps
  don't toggle.
- **Live TV category states match the comps** (`MobileLiveTvPage`): featured live-program card
  now shows only for **All + Sports** (its own category); News/Entertainment/Movies/Kids drop
  straight to a titled list whose heading is the category name (featured-shown → "All Live
  Channels"). Channel badges are category-tinted (News maroon, Entertainment/Kids purple, Movies
  pink, Sports neutral); the first row of a featured view gets a gold left-accent. Verified all
  6 states (featured shown/hidden, title, row counts) + badge colours + no overflow.

## 2026-07-24 — Mobile: Live TV page + Shorts share/like + drag-follow swipe (increment 5)
- **Mobile Live TV** (`MobileLiveTvPage`, below md via new `LiveTvScreen` useIsMobile switch;
  `/live` moved to its own `MainLayout revealFooter mobileTopBar="status"` group so it keeps
  its own "Afriplay Live Tv" gold header instead of the app logo bar). Content: header + Get
  Bundle + notification · category chips (All/Sports/News/Entertainment/Movies/Kids, filter
  the list + sync `?category=`) · featured live program card (LIVE + watching, SuperSport logo
  + "· Ch 5", title/subtitle gold, collage, times + progress, Watch Now + Full Guide) · "All
  Live Channels" + count · channel list. Uses a mobile-scaled `MobileLiveChannelRow` (the
  desktop `LiveChannelCard` is `--vw`-locked to a 768px min, can't scale to the 390 comp).
- **Shorts share sheet** (`MobileShortsPlayer`): Share rail → bottom sheet (reel row, "Share
  via" 5 brand circles WhatsApp/Facebook/Twitter-X/Instagram/Copy Link, URL field + Copy →
  "✓ Copied" 2s, Cancel).
- **Like fix**: double-tap the video now *toggles* like (burst only when it becomes liked),
  matching the rail heart — previously double-tap only ever liked.
- **`resolveReel` fix** (`shortsFixtures.js`): now also resolves circular-rail (`sr*`) and
  LIVE-hero (`live-1`) ids, not just `fy*`/`tn*`/`reel-*`. Those feed tiles previously bounced
  straight back to `/shorts` (null reel → redirect).
- **Drag/transition pass** on the swipe (resolves the increment-4b deferred note): media is now
  a 3-frame track (prev −100% / current 0 / next +100%) translated 1:1 with the finger (rubber-
  banded 0.22× at the ends); release commits if past 60px or flicked >400px/s, sliding the frame
  fully out over 200ms `cubic-bezier(0.32,0,0.67,0)` then navigating, else snaps back. Taps that
  moved >6px are suppressed so a drag doesn't fire like/pause. Wheel + ↑/↓ keys unchanged.
- Verified at 375–390px (DOM/event-dispatch; screenshots time out here): Live TV all sections,
  no overflow, News chip → 3 rows + gold active + URL sync; share sheet opens, Copy→"✓ Copied";
  like toggles both ways (rail + double-tap, path `fill` none↔#c2b801, burst shown); drag
  reel-2→reel-3 commits, 30px drag snaps back to translate3d(0,0,0), last reel has no next frame
  + hint hidden. Console clean. `npm run build` ✓.

## 2026-07-18 — Mobile responsiveness: Shorts player (increment 4b)
- Built `MobileShortsPlayer` (full-bleed, below md, via `ShortsPlayerScreen` useIsMobile
  switch; route stays `mobileChrome={false}` — the player self-renders its status bar +
  bottom nav so the video fills the screen):
  - Full-bleed vertical video (still frame; scrub UI-only) with top/bottom scrims · top bar
    (back / "Afrishorts" / more) · filter chips · right action rail (follow avatar, like +
    count, share, My Stuff — gold-outlined) · bottom-left caption (badge, handle, title,
    Watch full episode, gold hashtags, audio) · progress bar.
  - **Follow** (spec screenshot 3): tap avatar +badge → follows, `+`→`✓` on gold, toast
    slides up ("Following @handle" / "You'll see their reels in feed", 3s auto-dismiss, × to
    close); tap ✓ → **Unfollow confirmation dialog** (Cancel / Unfollow). My Stuff add fires
    its own toast.
  - **Like** via the rail heart (neutral circle, heart-only gold) and **double-tap** the
    video (burst).
  - **Swipe navigation** (spec screenshot 5): touch swipe up → next reel, down → prev
    (40px threshold), plus wheel + ↑/↓ keys; bounded (no wrap — first reel no up, last no
    down); "Swipe up for next" hint when a next reel exists. Reel steps use replace nav.
  - Verified at 390px: video 390×844 full-bleed; follow +→✓+toast→unfollow dialog→cancel;
    like toggle; swipe up→reel-2, down→reel-1, wheel→next; no overflow. Desktop 1280
    unchanged (desktop card player, no mobile chrome). `npm run build` ✓.
  - Deferred polish (flagged): the live drag-follow *peek* of the next reel during the swipe
    (screenshot 4 mid-transition) + <250ms slide easing + haptics + 65% progress arc —
    current swipe is threshold-commit then swap, not a finger-tracking transition.
    → ✅ RESOLVED 2026-07-24 (increment 5): finger-tracking drag + peek + 200ms slide easing
    shipped. Haptics + progress arc still not done (no haptics API use; optional).

## 2026-07-18 — Mobile responsiveness: Shorts feed + skeleton (increment 4)
- Built `MobileShortsPage` (below md, via new `ShortsScreen` useIsMobile switch; `/shorts`
  now `mobileTopBar="status"` so the feed supplies its own AfriShorts header):
  - AfriShorts header (gold) + Get Bundle + avatar/notification · filter chips
    (For You/Trending/Sports/Movies) · circular rail (`shortsForYou`, 9) · LIVE hero
    (`liveReelPreview`) · Trending Now (ranked horizontal cards, `trendingNow`) · For You
    2-col grid (`forYouGrid`, 16). Hero/cards/tiles link to `/shorts/:id`.
  - Full-page loading skeleton mirroring the layout (header/chips/circles/hero/trending/grid
    placeholders) — shows ~800ms on mount and persistently via `/shorts?loading=1`.
  - Verified at 390px: `?loading=1` → 21 pulse blocks (mobile skeleton, not desktop); loaded
    → AfriShorts gold header, chips, LIVE hero, Trending Now, 16 grid tiles, no overflow.
    Desktop `/shorts` unchanged at md+. `npm run build` ✓.
  - Verification gotcha logged: `location.href=` reloads reset the CDP-emulated viewport to
    1280 (looked like a useIsMobile miss); use the navigate tool (preserves viewport). And
    first-load compile can eat the 800ms mount-skeleton window — check the skeleton via
    `?loading=1`.
- **NEXT**: mobile Shorts *player* (screenshot 5 — full-bleed video + right action rail +
  caption + progress + bottom nav). Not built this turn.

## 2026-07-18 — Mobile search: default-landing vs focus-panel split (increment 3g)
- **Corrected a persistent misread**: recent + trending are NOT the default search landing.
  User clarified — the default `/search` landing is a **browse view** (filter tabs + Best
  Results hero + Movies/Tv Shows/TV Channels grids of the full catalog); Recent + Top
  Trending (+ Browse By Categories) appear ONLY when the search box is **focused** (tapped
  to type). Restructured `MobileSearchPage` accordingly:
  - `renderTabbedContent(items, queryLabel)` now shared by the default landing
    (`items=library`, no "Found" line) and committed results (`items=matches`, with line).
  - Re-added `focused` state → empty+focused shows the recent/trending/categories `focusPanel`;
    empty+blurred shows the browse. `focusPanel` wraps items in `onMouseDown preventDefault`
    so taps commit instead of being eaten by the input blur (verified: tapping a trending
    row set the query and rendered results, panel not lost).
  - Escape blurs back to the browse.
  - Verified at 390px: navigation → browse (tabs + Best Results + Movies group, NO
    recent/trending); focus → Recent + Trending + Browse By Categories (browse hidden);
    trending tap → "Found 02 results for 'Soyayya Ruwan Zuma'" + Best Results + Movies, no
    overflow. `npm run build` ✓.
  - Browse By Categories now lives in the focus panel (was the old "landing"); flag if it
    should instead sit in the default browse.

## 2026-07-18 — Mobile search landing: add Tv Channels section (increment 3f)
- User reported the landing looked incomplete on tapping Search. Root cause check:
  Browse By Categories WAS rendering (9 tiles) — just below the fold (page 1283px vs 844px
  viewport), so their screenshot was scrolled to the top, not a bug. The genuinely missing
  piece was a **"Tv Channels" browse section** (their second screenshot, a part not sent
  earlier). Added it below Browse By Categories on the landing: `Tv Channels` header +
  2-col landscape channel cards (`MobileChannelTile`, `library` channels, 5 items).
- Landing sections now: Recent Searches → Top 5 Trending → Browse By Categories → Tv
  Channels. Verified at 390px: all four h2s render, channel grid = 2-col/5 tiles, page
  scrolls (1708px), last card clears the floating nav (bottom 614 < nav top 763), no
  overflow. `npm run build` ✓.

## 2026-07-18 — Mobile search: Best Results hero (increment 3e)
- User's "search landing" screenshots were actually the committed results (All tab) and
  revealed the missing piece: a **"Best Results" featured card** at the top of the All-tab
  results (between the count line and the Movies group). Built `MobileBestResult` — a
  sponsored/ad slot: featured backdrop (`search-mobile-best-results-featured-backdrop.webp`)
  + "Best Results" purple badge + Stranger Things title art + "Advertisement" label + NTA
  advertiser logo (`search-mobile-nta-advertiser-logo.webp`) + genre pills (gold dot
  separators). Shows on the All tab only (not on Movies/Tv Shows/TV Channels tabs).
- Verified at 390px: badge + Advertisement + NTA logo present, hero renders above
  "Movies (…)" on All, absent on the Movies tab, no overflow. `npm run build` ✓.
- Note: this frame showed 3 tabs (All/Movies/Tv Shows) vs the 4 (incl. TV Channels) in the
  earlier batch — kept all 4 since TV Channels is a real result type with its own screens.

## 2026-07-18 — Mobile search: edge cases + slow-network skeleton (increment 3d)
- Third batch of screenshots = edge cases; all four built into `MobileSearchPage`:
  - **Zero results**: ⓘ icon + "No results for" + gold query + **"Did you mean" pill**
    (suggestion = top trending term, same `⚠️` static stand-in as desktop) + divider +
    the Top 5 Trending section below as a fallback path (trending block refactored into a
    shared `trendingSection` used by landing + zero-results).
  - **Connection Error**: unchanged copy + **⟳** glyph added to the gold Try Again pill.
  - **Slow-network results skeleton** (`MobileResultsSkeleton`): real filter tabs + pulse
    placeholder count-line/hero/grid at the sizes real results use. Shows during a 600ms
    commit window (stands in for the API fetch; real API will drive it) and persistently
    via **`/search?loading=1`** for demos.
- **`useIsMobile` hardened**: CDP-emulated viewport resizes don't fire the matchMedia
  `change` event, so the mounted variant never swapped on resize (caught during
  verification — matches:true but desktop page still mounted). Added a `window resize`
  fallback listener; cheap insurance for real devices too.
- Verified at 390px: "Zxqrty movyes" → zero-results with Did-you-mean + trending; "offline"
  → Connection Error with ⟳; commit "the" → 9-pulse skeleton with tabs → grouped results
  (0 pulses); `?loading=1` → persistent skeleton. `npm run build` ✓.
- (Dev server on 5173 was found dead again during verification — started a fresh one; no
  processes killed.)

## 2026-07-18 — Mobile search: result filter tabs + channel cards (increment 3c)
- Second batch of results screenshots added the committed-results chrome the earlier build
  lacked:
  - **Result-type filter tabs** (All / Movies / Tv Shows / TV Channels, gold active) above
    the results, reset to All on each new commit.
  - **"Found NN results for '{query}'"** line (adds "in {Tab}" when a specific tab is
    active; NN zero-padded to match the design's "06"/"03"/"02").
  - **All** tab → all non-empty groups stacked; a **specific** tab → just that group
    (with its own "Label (NN)" header) or a per-tab empty message.
  - **TV Channels render as 2-col landscape cards** (`MobileChannelTile`) vs the 3-col
    poster tiles (`MobilePosterTile`) for Movies/Tv Shows — both gold-bordered.
  - Verified at 390px: "the" → All ("Found 05 …", Movies (02) + Tv Shows (03)); Movies tab →
    "Found 02 … in Movies"; "afriplay" → TV Channels tab → "Found 05 … in TV Channels",
    2-col grid, 5 tiles; no overflow. `npm run build` ✓.
  - Result tiles are no-op for now (route to Movie/Series Details when that page exists).

## 2026-07-18 — Mobile responsiveness: search typing/results flow (increment 3b)
- Extended `MobileSearchPage` into the full flow from the second batch of screenshots:
  - **Active**: gold focus ring on the search box (pure CSS `focus-within` — robust; verified
    gold when focused, default when blurred).
  - **Typing**: debounced (400ms) `Searching…` spinner.
  - **Autocomplete**: up to 3 suggestion rows (magnifier + title) + a flat 3-col poster grid
    of matches (gold-bordered tiles). Shown while typing, before commit.
  - **Committed** (Enter or tap suggestion/tile): results grouped by type — `Movies (NN)` /
    `Tv Shows (NN)` / `TV Channels (NN)` (zero-padded counts) each a 3-col grid.
  - **Zero results** + **Connection Error** (`offline` demo) mobile states.
  - Reuses `searchFixtures.library` + `MIN_QUERY_LENGTH` + the offline demo, mirroring desktop.
  - Verified at 390px: empty→landing; "the" → autocomplete (5 tiles, NOT grouped) → Enter →
    grouped (Movies + Tv Shows, correct counts, no empty TV Channels group); no overflow.
    `npm run build` ✓.
- **Judgment call flagged**: the design's "active state" frame is a blank focused box. On web
  that reads as broken (no keyboard to fill it), so empty query always shows the landing and
  the box just gains the gold ring. Easy to flip to literal blank-on-focus if wanted.
- **Bottom nav**: user confirmed keep it consistent with the homepage (Home/Live Tv/Shorts/
  Search/More) on search too — matches screenshot 5. No change; already shared.
- Note: fixture `library` has no "Stranger*" titles, so the design's "Stranger" query shows
  zero results in-app — use e.g. "the"/"love"/"sweet" to populate the states with real data.

## 2026-07-18 — Mobile responsiveness: search landing (increment 3)
- **Diagnosed the "changes didn't work" report**: the user was viewing `/` (LandingPage,
  the signed-out teaser page the auth port added), NOT `/home` where the mobile work lives.
  LandingPage gated its redirect on the raw `user_info` cookie instead of
  `isAuthenticatedUser()` (which honours VITE_BYPASS_AUTH), so in dev `/` rendered its own
  desktop hero. Fixed LandingPage to use `isAuthenticatedUser()` → `/` now redirects to
  `/home` in dev; prod signed-out behaviour unchanged. (Standalone LandingPage still has a
  desktop-only hero — no mobile design for it yet, flagged.)
- **Mobile search landing built** (`/search` below md), from the 5 supplied screenshots:
  - `useIsMobile` matchMedia hook + `SearchScreen` wrapper: renders `MobileSearchPage`
    below md, desktop `SearchPage` at md+ (single variant — search is stateful).
  - `MobileSearchPage`: search box (350×52 comp) · **Recent Searches** (Clear All +
    per-item remove X + See More/See Less past 5) · collapsible **Top 5 Trending Searches**
    (chevron hides/shows the list) · **Browse By Categories** 3×3 grid = Home genres (5) +
    search-only set (4) = 9 tiles. Recent persists to the shared `afriplay:recentSearches`
    localStorage key. Empty recent → first-time state (trending + categories only), which is
    also what Clear All lands on.
  - `MainLayout` gained `mobileTopBar` prop: search passes `"status"` → status bar only (no
    logo row, matching the design; the page supplies its own search box). Home stays `"app"`.
    Did NOT touch MobileTopBar/MobileHero (user is manually adjusting those).
  - Verified at 390px: all sections + no overflow; See More 5→6→See Less; per-item remove
    6→5; trending collapse 5 rows→0; Clear All → recent section gone. At 1280px: desktop
    SearchPage renders, no regression. `npm run build` ✓.
  - Deferred (no mobile design yet): typing/results on mobile — the box is functional but
    the landing sections stay shown. Also the bottom-nav lineup differs between the home
    designs (Home/Live Tv/Shorts/Search/More) and these search designs
    (Home/Movies/Live Tv/Search/More) — kept one consistent nav, flagged to user.

## 2026-07-18 — Mobile status bar (increment 2b)
- Added the faux device **status bar** to the mobile app top bar (part of the design
  mockup): `MobileStatusBar` — **live clock** (real time, refreshes every 20s) left;
  signal / wifi / battery (shipped `home-mobile-statusbar-*` glyphs) right. Sits above the
  logo row in MobileTopBar's "app" variant; hero chips nudged to `top-100` to clear the
  taller bar.
- Bug caught + fixed in the same pass: `w-auto` on the status icons ballooned one SVG
  (wide viewBox) to ~300px, overflowing the page to 967px. Fixed with explicit widths +
  `object-contain`; page back to exactly 390. Verified: icons + live clock render at 390,
  no overflow; status bar hidden at md+ (desktop unaffected). `npm run build` ✓.
- Battery shows the static design glyph (not real battery level — the Battery API is
  deprecated/unavailable in most browsers); flag if a live level is ever wanted.

## 2026-07-18 — Mobile responsiveness: homepage hero + fixes (increment 2)
- **Root cause of the "broken hero"**: HomePage rendered the desktop `HeroSection` at all
  widths; its content block is `w-[calc(1607/1728*var(--vw))]` (~714px, --vw floors at 768)
  inside a 390px viewport → massive horizontal overflow / overlap. Fixed by building a
  portrait mobile hero and swapping at md.
- **`MobileHero`** ([src/components/sections/home/MobileHero.jsx]): 390×640 comp, filter
  chips (All/Movies/Tv Shows) under the top bar, centred badge + title art + genres +
  pagination dots + Watch Now (gold) / + (circle). Two states via Watch Now toggle: poster
  ↔ playing (centre play/pause overlay; UI-only, no media files — same caveat as the reels
  player). Uses the shipped `home-mobile-hero-*` assets. Wired into HomePage as
  `hidden md:block` (desktop HeroSection) ↔ `md:hidden` (MobileHero).
- **Ad banner was 404ing**: HomePage passed `asset: "../../assets/GLOTV.svg"` as a raw
  runtime string (Vite never bundled it). Fixed to a real `import gloTvAd from
  "../../assets/GLOTV.svg"`. `⚠️` This is the GLO creative; the mobile design shows a
  *BundleFlix* banner, but no BundleFlix asset shipped — flagged for when it does.
- **Added the missing "Upcoming TV Shows"** rail (new `upcomingTvShows` fixture, reuses
  existing poster images) — it wasn't in the code at all.
- **Verified** at 390px: no horizontal overflow, hero exactly 390×640, chips + Watch Now,
  poster↔playing toggle, Movies chip activates gold, banner image loads, Upcoming present.
  At 1280px: single desktop hero, mobile hero hidden, no regression. `npm run build` ✓.
- **STILL TODO (flagged to user)**: the rails *below* the hero are still desktop-fluid-scaled
  (frozen at the 768 basis — scrollable but not reflowed to the 390 comp), and the mobile
  design has a different section lineup/order than desktop (adds AfriPremiere, Trending Now;
  BundleFlix vs GLO). Proposed next: a dedicated mobile homepage composition to match the
  design section-for-section — awaiting user direction on that architectural step.

## 2026-07-18 — Mobile responsiveness: foundation + chrome (increment 1)
- **Started the mobile responsive pass** (user supplied 390-comp designs for Home +
  Video-Playing states). This increment = the load-bearing foundation + app chrome only;
  the homepage body (hero + rails) reflow is the next increment (task open).
- **Mobile fluid basis**: added `--mvw: clamp(320px,100vw,430px)` to App.css — the exact
  mirror of the desktop `--vw` system, so mobile sizes author as `calc(P/390*var(--mvw))`
  and translate 1:1 from the 390 comp, scaling proportionally across phone widths.
- **Breakpoint**: `md` (768px) is the mobile↔desktop split. Below md → mobile layout +
  mobile chrome; at md+ → the existing desktop layout (unchanged, still floors at 768 via
  --vw). The 431–767 range shows a centred phone-width column (--mvw caps at 430).
- **Chrome** (adapted the two orphaned components from an earlier session, which already
  had the right shape): `MobileBottomNav` — floating glass pill, `fixed` bottom-anchored,
  centred, 5 tabs (Home→/home, Live Tv, Shorts, Search, More), active tab gold + subtle
  highlight. `MobileTopBar` gained an **"app" variant** (logo left; Get Bundle + notification
  + avatar right), transparent overlay that scrolls with the hero; the shorts feed/player
  variants are retained.
- **MainLayout**: new `mobileChrome` prop (default true). At md+ renders Navbar (top) +
  Footer as before; below md hides both (`hidden md:block`), shows MobileTopBar + the
  floating MobileBottomNav, and pads `main` bottom to clear the floating nav. reveal-footer
  math gated to `md:`. Auth group + Shorts player pass `mobileChrome={false}`.
- **Verified**: at 390px — top bar (logo + Get Bundle), floating bottom nav centred (~19px
  side margins, ~16px off bottom), 5 tabs, Live Tv tab click → /live with gold+highlight
  active state, desktop nav & footer hidden. At 1280px — desktop nav + footer back, mobile
  nav hidden. `npm run build` ✓ (svgr `?react` icon imports resolve).
- Note: `More` tab → `/more` (no route yet → catch-all → `/`); intended to open a sheet with
  Tv Channels/Movies/My Stuff once those exist. Left as a placeholder, `⚠️`.

## 2026-07-17 (l)
- **Play-button flicker fixed** (user repro: tap → pause bars for a split second → triangle
  → pause bars again while fading). Two causes in ReelPlayerCard: (1) the flash flag was set
  in a `useEffect`, which runs *after* paint — so one frame rendered `playing=true` with no
  flash, showing the pause bars before the triangle; now a `useLayoutEffect` sets the phase
  before that frame paints. (2) the icon swapped to pause bars the moment the flash ended,
  i.e. *during* the 500ms fade-out; now a three-phase machine (`flash` 900ms → `fading`
  500ms → `idle`) keeps the triangle through both visible phases — pause bars exist only
  for the hover-reveal once fully hidden. Verified by sampling each phase: triangle/visible
  → triangle/visible (the old flicker frame) → triangle/fading → pause-bars/hidden.
  `npm run build` ✓.

## 2026-07-17 (k)
- **Shorts player: play/pause feedback + stream-ready arrow logic.** `npm run build` ✓,
  click-verified.
  - Tapping the video to play no longer makes the center button vanish instantly: it holds
    the play triangle visible for ~900ms (`playFlash` in ReelPlayerCard) then fades over
    500ms. While playing, hover reveals a **pause-bars** glyph (drawn inline — no pause
    icon asset shipped) instead of the play triangle. Verified sequence: paused/visible →
    tap → visible through the flash → hidden after, pause bars present for hover.
  - **Continuous-stream question answered + hook added**: bounded arrows derive from
    `currentIndex` vs queue length, so with a paginated API "last reel" only exists when
    the feed is exhausted. Added `hasMoreReels` (currently `false`, `TODO: missing API`)
    into `canGoDown` — integration drives it from /api/shorts pagination and prefetches
    the next page near the queue end; the ↓ arrow then never disappears mid-stream.

## 2026-07-17 (j)
- **The user's ACTUAL back-button bug fixed** (previous entry's traps were real but not
  the reported one): search landing → committing a search used
  `setSearchParams({q}, {replace: true})`, which REPLACED the `/search` landing history
  entry with `/search?q=…` — Back skipped the landing entirely and landed on whatever
  preceded it (their case: /shorts). Two-part fix in [SearchPage](../src/pages/SearchPage.jsx):
  (1) landing→results (empty→query) now PUSHES; query *edits* still replace so typing
  doesn't spam history; (2) added a URL→state sync effect so browser Back/Forward adopts
  the URL's `q` — without it the old state→URL effect immediately re-wrote the query and
  undid the Back. Verified: /shorts → /search (idx 1) → chip commit → ?q=Nollywood
  (idx 2, pushed) → Back → /search landing, input cleared ✓.
- **Shorts player arrows now bounded** (user direction — supersedes the 2026-07-16
  wrap-around choice): first reel shows only ↓, last only ↑, both in between; wheel/keys
  clamp at the edges. Fallback reels (grid/trending ids not in the `reels` queue) sit
  "before" the queue: only ↓, entering at reel 1. `ReelNavArrows` gained
  `showUp`/`showDown`. Verified across reel-1/2/3 + fy1 + over-scroll at the last reel.
  `npm run build` ✓. Updated [[shorts-reels]].

## 2026-07-17 (i)
- **Back-navigation traps fixed** (user report: "going back lands on an entirely different
  page"). Three separate push-vs-replace bugs, all the same root pattern — *redirects and
  in-place steps were pushing history entries*:
  1. **Auth guard trap** (from the `e2002bf` auth port): SignUp/SignIn/ResetPassword run an
     effect that sends you to `/select-network` when no operator is chosen — it PUSHED, so
     Back landed on the auth page, whose effect instantly pushed you forward again. You
     could never get back past /signup. Now `replace: true` (also on the already-authed
     `navigate("/")` bounce, and SelectNetwork's continue-to-destination).
  2. **Reel stepping** (ShortsPlayerPage `goToOffset`): every wheel/arrow step pushed
     `/shorts/:id` — Back walked through every reel viewed. Now `replace: true`; a whole
     reel-viewing session occupies ONE history entry.
  3. **Player back/Esc** pushed a fresh `/shorts` instead of popping — after "going back",
     pressing browser Back returned you INTO the player. Now a `goBack()` helper: real
     `navigate(-1)` when React Router's `history.state.idx > 0`, `/shorts` (replace) only
     for direct deep links.
  - Verified in-browser: `/` → Shorts → back → `/` ✓; player entered at idx 2, scrolled 3
    reels, idx stayed 2, back button popped to `/shorts` idx 1 ✓. `npm run build` ✓.
  - Note: dev has `VITE_BYPASS_AUTH` on, so trap #1 only bites with the guard live
    (production / bypass off) — fix verified by code path, not repro.

## 2026-07-17 (h)
- **Five search-results design mismatches fixed** (user-reported Figma deltas; corrected
  from the previously-supplied reference screenshots — Figma MCP not available, needs
  Dev Mode enabled in the user's Figma desktop app). `npm run build` ✓, all verified
  in-browser:
  1. **Glassmorphism**: suggestions panel + active SearchBar were opaque `bg-gray-10`;
     now `bg-black/50 backdrop-blur-2xl` (blur 40px) so dimmed content shows through.
     `⚠️` blur/opacity values approximated from screenshots — verify against Figma.
  2. **Result-type tabs moved directly under the search box** (were below the hero).
     Order now: tabs → count line → hero → groups, in [SearchResultsSection](../src/components/sections/search/SearchResultsSection.jsx).
  3. **Count line**: now `Found N results for "query"` (query white/semibold), left-aligned
     under the tabs — was `N results for "query"` right-aligned in the tabs row.
  4. **Hero rebuilt to the design's composition**: "Best Results" purple badge top-left,
     "+" circle (fires the My Stuff toast) top-right, title art, ★ 8.5 | TV-14 | 2024 row
     (new `rating` fixture field), genre pills, decorative `PaginationDots` bottom-right.
     REMOVED: "98% Match · Top Result" line, description paragraph, Play/My Stuff buttons
     (not in the design). `⚠️` dots are decorative — single fixture hero, no carousel.
  5. **Gold border added to `CompactPosterTile`** (`border-prim-gold/70`) — applies to
     results grids, autocomplete posters, and the landing Recommended grid alike.

## 2026-07-17 (g)
- **Fixed broken build** ("find the problem"): `vite build` failed with *Rollup failed to
  resolve import "axios" from src/api/refreshToken.js*. Root cause: commit `e2002bf`
  ("feat(auth): port legacy auth" — operators, OTP flows, login/refresh, protected routes,
  from a concurrent session) added axios / universal-cookie / uuid / ua-parser-js to
  package.json, but `npm install` was never run in this working copy — none of the four
  existed in node_modules. Fix: `npm install`, then `npm run build` ✓ (bundle 369→489 kB
  now that the auth layer compiles in). Smoke-tested the running dev server: Home renders,
  no console errors. Note: a dev server started before the install may need a restart if
  Vite serves stale optimized deps on the new auth pages.

## 2026-07-17 (f)
- **Live TV polish tweaks** (user review of the rebuild): `LiveChannelCard` padding
  16→22 comp px; hero text↔collage gap reduced (gap 32→20 and the collage widened to
  510 comp px `object-cover`, trimming the collage's partial top/bottom tile rows —
  flagged in [[live-tv-epg]] as an intentional crop); hero purple gradient deepened
  (`#1c0b33/#22103e/#120722`). `npm run build` ✓, verified via computed styles/rects.
  **Next up per user: mobile responsiveness pass.**

## 2026-07-17 (e)
- **Live TV page fully rebuilt** against five user-supplied reference screenshots.
  `npm run build` ✓; layout/interaction verified via rects + real clicks in the dev server.
  - Page shell: full-width search bar at top (no "Live TV" h1), category chips renamed to
    **Sports** (plural), main column + sidebar grid.
  - Hero: LIVE + "124.5K watching", SuperSport logo + "SuperSport · Ch 5", two-line title
    (white/gold), flags + 2–1 score + red 67' pill, times + gold progress bar, Watch Now /
    Full Guide buttons; collage still contained right (see [[live-tv-epg]] hero note).
  - [LiveChannelCard](../src/components/cards/LiveChannelCard.jsx) rewritten as the rich EPG
    card (channel + category chip, LIVE + title, Next line, bell, progress bar, gold border
    when active) — shared by the sidebar AND the schedule's live segment.
  - [OnAirScheduleSection](../src/components/sections/liveTv/OnAirScheduleSection.jsx):
    "On Air Today" + fixture date, underline tabs **All / Earlier Today / Coming Up**;
    All tab is chronological (Replay rows → live cards → Remind rows); gold Replay/Remind
    pills use the shipped white-stroke icons darkened via `brightness-0`.
  - Sidebar: "All Live Channels" + count pill (25) + "See All →".
  - Search bar now actually filters the live-channel cards (was cosmetic); verified
    "telemundo" → 9 cards → 1.
  - Fixtures rewritten to the reference copy; every row/card categorised so all five chips
    genuinely filter (closes the old only-Sport-has-data `⚠️`). Only SuperSport has a real
    logo asset — all other channel logos are Home channel-card placeholders, flagged in
    [[live-tv-epg]].
  - Testing note: the page now has TWO "All" buttons (category chip + schedule tab) — a
    text-match click on "All" grabs the chip first. Cost one confused verification round;
    scope button lookups to their container.

## 2026-07-17 (d)
- **Seventh review pass.** `npm run build` ✓; all behaviors verified via DOM/event dispatch.
  - **Live TV "messy" hero — root cause finally found by Reading the asset itself**: the
    only shipped EPG image (`epg-sport-featured-live-program-match-graphic.webp`) is a
    square **3×3 collage of rounded tiles** (crests/trophy with transparent gutters), NOT a
    full-bleed hero photo. Stretching it `object-cover` behind the text produced the broken
    look (stray card edges, text in gutters). [FeaturedLiveProgram](../src/components/sections/liveTv/FeaturedLiveProgram.jsx)
    restructured: dark purple gradient card, collage `object-contain` on the right (~313px
    square at 1280w), text panel on the left with a legibility scrim. Verified via rects.
  - **In-panel search states built per the user's three reference screenshots**: the panel
    now hosts the full flow — empty → Recent/Trending · short query → hint · debounce
    pending → **spinner "Searching…"** (reinstated; the skeleton stays as the page-level
    slow-network state, renamed `ResultsSkeleton`, still forceable via `/search?loading=1`)
    · `"offline"` → **Connection Error** ("We couldn't reach the server…" + gold ⟳ Try
    Again) · no matches → **zero results** ("No results for" + query in gold). Page-level
    duplicates suppressed while the panel is open. All states text-verified.
  - **ZeroResultsMessage/NetworkErrorMessage restyled** to the reference copy/layout (gold
    query line, gold Try Again pill).
  - **Misleading "Added to My Stuff" toast removed from tile clicks** (landing Recommended
    + results tiles). Root cause of "why don't tiles route anywhere": there is no
    Movie/Series Details page yet — the toast was a placeholder `onClick` from the first
    build. Tiles are now no-ops with a comment pointing at [[api-contract]]/api-docs (Watch/+
    should route to Details pages when they exist). Toast stays on the hero's explicit
    "My Stuff" button only.
  - **Results tabs logic — answered, not a bug**: results ARE grouped into all sections with
    matches on "All" (verified: q="the" → "Movies (2)" + "TV Shows (3)"; TV Shows tab →
    just "TV Shows (3)"). The user's "The Chi" example showed only a TV Shows section
    because that title exists solely as one TV show in the fixture catalog — 1 result total,
    so All correctly rendered the only non-empty group.

## 2026-07-17 (c)
- **Sixth review pass fixes.** `npm run build` ✓; each behavior below verified by DOM/event
  dispatch in the dev server.
  - **Recent Searches restructured to a vertical column** (was a row of pills): each row is
    clock icon + label + X on the right, no pill background, hover highlight — matches the
    dropdown reference. 5-cap + gold See More retained.
  - **Search AutoComplete state built** (Figma `2883:4988`, previously skipped with an
    `⚠️ ASSUMPTION` note in [[search]]): typing with the panel open now shows live title
    suggestions (query echo + up to 3 matching titles, search icon per row) plus a grid of
    matching poster tiles inside the panel. Clicking either commits instantly.
    **Enter commits the raw query** (skips the debounce, closes the panel, blurs).
  - **Skeleton now routable**: `/search?loading=1` forces the results skeleton so it can be
    demoed — the user couldn't find it because it only flashes during the 400ms debounce.
    (Results page itself: `/search?q=<anything>`, e.g. `/search?q=love`.)
  - **Shorts player: stray "head-like shape" fixed** — it was the decorative
    `shorts-play-reel-player-gesture-{halo,ring,arrow}.svg` stack rendered above the play
    button while paused. Removed entirely; replaced with the reference's double-tap
    affordances: a heart-in-rings **like burst** on double-click (~0.7s) and a subtle
    "♥ Double tap anywhere to like" hint while paused.
  - **Like button: only the heart colors gold now** — the circle stays neutral. Required
    inlining the heart path as an SVG component (`HeartIcon` in ReelActionRail) because the
    shipped asset hardcodes gold fill and `<img>` can't be recolored.
  - **Double-click now toggles like** (second double-click un-likes) — was like-only.
  - **Top-right video controls (mute/fullscreen/more) share ONE pill container** — were
    three separate circles.
  - **Nav arrows moved to the page's right edge** (absolute, vertically centered) — were
    directly beside the action rail.
  - **Save button relabeled "My Stuff"** (was "My List") per the reference screenshot and
    the My Stuff collection direction ([[open-questions]] #22).

## 2026-07-17 (b)
- **Fifth review pass fixes.** `npm run build` ✓; every item below click-verified in the
  dev server (screenshot tool still broken; used DOM/event dispatch + computed rects).
  - **Search: suggestions panel now opens on every focus**, including re-focusing with an
    existing query (user's repro: search "the chi", click the bar again → nothing happened).
    Was gated on `trimmed === ""`; now gated on focus alone, and **typing collapses it** so
    the hint/results underneath stay visible (SearchPage's `onChange` closes the panel).
  - **Search Recommended grid: 6/row via `CompactPosterTile`** (was still `PosterCard` at
    4/row on the *landing* grid — the 2026-07-17 fix had only converted the *results* grid;
    user correctly called out the omission). Page size now 12 (two rows of 6);
    pool is `recommended` = 33 items.
  - **See More/See Less pill rebuilt manually** (user reversed the earlier "use the svg"
    instruction after seeing it): hand-built pill (bg + ↓/↑ glyph + label), one button that
    swaps to "See Less" only when everything is expanded, collapsing back to 12. Verified:
    12 → 24 → 33 → See Less appears → 12.
  - **Homepage: `AdBanner` slot added** between Live On TV Now and Top 10 Movies
    ([AdBanner.jsx](../src/components/sections/home/AdBanner.jsx), fixture
    `homeFixtures.adBanner`) — modeled on the GLO TV reference ad (headline with accent
    word, tagline, "stream on the app" CTA, hand-built store badges, tilted poster,
    brand mark). `⚠️` No ad creative/asset shipped — all placeholder styling around a
    reused poster; swap when a real ad source exists.
  - **Footer: white decorative circles REMOVED** (`FOOTER_CIRCLES`, Footer.jsx) — user
    reversed the earlier keep-them direction.
  - **Shorts player: caption block moved OUT of the video card** to the page's bottom-left
    (per the reference screenshot — it was overlaid inside the card's bottom scrim).
    `ReelCaptionPanel` now renders absolutely at page level; card keeps controls +
    progress bar only. Badge restyled gold-outline + added the small avatar circle
    between badge and handle (both visible in the reference).
  - **Double-click-to-like**: like state lifted to ShortsPlayerPage; double-click anywhere
    on the video sets liked (Instagram-style, doesn't unlike), the rail's Like button
    toggles. Single click on the video toggles play/pause via a 250ms timer so a
    double-click doesn't also fire it. All three behaviors click-verified.
  - **Answered — video-to-video**: yes, the logic is in place — wheel scroll (one gesture =
    one step), ↑/↓ keys, and the nav arrows all advance through the reel queue with
    wrap-around (re-verified after these edits: reel-1 → wheel → reel-2). What does NOT
    exist: *autoplay into the next reel when the current one ends* — impossible until real
    video files exist (there is no timeline; play/scrub are UI-only stills).
  - **Noted — My Stuff**: nav's "My Stuff" is intended to collect what users add via
    add-to-My-List/My Stuff buttons. Logged in [[open-questions]] #22 — the buttons are
    currently optimistic local state only; when `/my-stuff` gets built it needs a real
    persistence layer (likely a `myStuffSlice` + localStorage until an API exists).

## 2026-07-17
- **Fourth review pass fixes.** `npm run build` ✓; verified via bounding-rect/computed-style
  checks in the dev server (the `computer` screenshot action is broken this session — every
  attempt across multiple pages/tabs times out; used `getBoundingClientRect`/
  `getComputedStyle` instead, see notes below on what that could and couldn't confirm).
  - **Search results grid rebuilt to match the results reference**: added
    [CompactPosterTile](../src/components/cards/CompactPosterTile.jsx) (poster-only, no
    title/Play/Add overlay, 250px @ 1728 comp) for Movies/TV Shows — `PosterCard` (375px)
    only fit 4/row, the reference shows 6. [SearchResultsSection](../src/components/sections/search/SearchResultsSection.jsx)
    now groups results into labeled `Movies (N)` / `TV Shows (N)` / `TV Channels (N)`
    sections (matches Composition in [[search-results]], which already documented this
    grouping but the code hadn't implemented it — one flat mixed grid before). Measured
    in-browser: grid width 1187px, tile width 185px (250×1280/1728) → exactly 6 columns fit.
  - **Search "Searching…" loader rebuilt as a real skeleton** — was just a spinner + text;
    [[search-results]] had already flagged the `2883:11362` "Slow internet/skeleton" frame
    as *not built*, `❓ NEEDS-CLARIFICATION`. Now a placeholder-box skeleton (hero + 9/6/4
    tile rows) sized to match the real results layout exactly, so nothing jumps when content
    swaps in. Closes that `❓`.
  - **Footer removed from `/search` entirely** (`showFooter={false}`, own `MainLayout`
    instance) — the results/skeleton reference is a self-contained "Hug"-sized block with no
    footer following it; had briefly gained the reveal-footer effect in the previous pass.
  - **Recommended section's See More/See Less simplified to icon-only** — was text "See
    More" + the exported arrow SVG; now just the SVG alone (rotated 180° for "less"), no
    manually-typed label, per explicit instruction to stop hand-building what the asset
    already represents. Added the "See Less" counterpart (collapses back to 8) since only
    expand existed before.
  - **`ReelCaptionPanel` hashtags fixed to gold** (`text-prim-gold`) — were gray
    (`text-gray-1/80`), reference screenshot shows them gold.
  - **Live TV "looks messy"**: checked thoroughly — component code, spacing tokens, and
    every measurable layout property (row gaps, alignment between the two columns, tab
    positions) came back clean and consistent with the rest of the app; found no structural
    bug. Could not get a visual screenshot to check color/rhythm/density issues a human eye
    would catch that bounding-rect math can't. Asked the user for a screenshot or specifics
    rather than guess-and-change working code.
  - **Footer circles / reveal-together question, re-answered**: reiterated the 2026-07-16
    finding (circles are children of the sticky `<footer>`, confirmed 6 present via
    `getComputedStyle`, moving as one layer) since the user asked directly why nothing was
    "done" about it — nothing needed doing, it was already correct before this session even
    started touching Search/Shorts. Could not get a pixel screenshot to double-confirm this
    round; flagged that limitation explicitly rather than overclaiming certainty.

## 2026-07-16 (night)
- **Third review pass fixes**, all `npm run build` ✓ + verified against both the dev server
  and a `vite preview` production build (see debugging note below):
  - **Search suggestions panel now reads as one unified black panel.** [SearchBar](../src/components/shared/SearchBar.jsx) gained an `active` prop — when the suggestions overlay is open, it renders flush-top (`rounded-t-2xl`, `bg-gray-10`, bottom gold border) instead of its normal floating pill, sitting directly on top of the panel (`bg-gray-10`, `rounded-b-2xl`, no gap) so the two read as one continuous black card, matching the user's screenshot. Removed `backdrop-blur-sm` from the dimming backdrop — the content behind should darken, not blur.
  - **`RecentSearchesSection` now caps to 5 visible + a gold "See More"** (`search-edge-recent-searches-see-more-chevron.svg`) that reveals the rest — was showing all items with no cap.
  - **`TrendingSearchesSection` header** gets a small gold chevron (`search-trending-searches-sort.svg`) next to the title, matching the screenshot.
  - **Recommended section's "See More"** simplified to just the exported arrow SVG + text in a plain button (no manually-built pill/background) — same principle applied to Recent Searches' See More.
  - **`GenreChipsRow` pills enlarged** (padding 16/8→24/12, text-base→text-xl, gap 10→16) — were visibly smaller than the design and didn't reach the row's full content width.
  - **Debugging note**: spent a long detour chasing what looked like a real CSS bug (the active search bar rendering white instead of black) — turned out to be a browser-automation artifact, not a code bug. The automated browser tab isn't OS-focused, so Chromium freezes CSS transitions on it (`getAnimations()` showed `playState: running` stuck at `currentTime: 0`); `getComputedStyle` was reporting the transition's *start* value forever. Confirmed correct by force-finishing the animation (`anim.finish()` → correct black) and by testing against a `vite preview` production build directly. No code change was needed for this one — flagging so a future session doesn't rediscover the same dead end.
  - **Answered (not a bug):** `/movies`, `/tv-channels`, `/my-stuff` render `HomePage` because `App.jsx`'s catch-all `<Route path="*" element={<HomePage />} />` catches them — those three routes are commented out (no dedicated pages exist). Checked [[figma-frames]] and [[open-questions]] #3: there is no Figma frame, wiki page, or spec for standalone Movies/TV Channels/My Stuff landing screens anywhere — every "Movies"/"Tv Channels" reference in the raw dump is a Search result-type tab or a Live TV/EPG filter category, not a screen. Nothing to fix; these three destinations are simply unbuilt, as #3 already noted.
  - **Answered (already implemented):** the footer's white decorative circles (`FOOTER_CIRCLES` in [Footer.jsx](../src/components/ui/Footer.jsx)) already scroll up together with the link columns — they're children of the same `<footer>` element, which is what gets `position: sticky` under the reveal effect. Verified in the production build: 6 circles present, footer `position: sticky`, all riding together as one layer. This was already noted in Footer.jsx's own comment; no change needed, most likely already visible to the user once the reveal effect landed on non-Shorts pages in the previous round.

## 2026-07-16 (evening)
- **Follow-up fixes from user's second review pass**, all `npm run build` ✓ + manually
  verified in-browser:
  - **Reveal-footer applied everywhere, removed from the Shorts player.** It was only wired
    on Shorts before — Home/Search/Live footers just sat in normal flow. Added a `showFooter`
    prop to [MainLayout](../src/layout/MainLayout.jsx) (default true); the reveal effect now
    applies to every page that has a footer, and the player route uses
    `showFooter={false}` (own `MainLayout` instance in App.jsx, no footer at all — matches
    the full-bleed player design).
  - **Shorts Player: added scroll-wheel navigation.** Only ↑/↓ keys + nav arrows worked
    before; user expected mouse-wheel scroll to step through reels too (TikTok-style). Added
    an `onWheel` handler with a 600ms lock so one scroll gesture (which fires many small
    `wheel` events) advances exactly one reel, reusing the existing wrap-around `goToOffset`.
  - **Search: fixed a real `no-scrollbar` bug.** `BrowseCategoriesSection` and
    `GenreChipsRow` used a Tailwind class `no-scrollbar` that was never defined anywhere —
    same failure mode already fixed once for `scrollbar-hide` (see App.css's own comment on
    that). Switched both to `scrollbar-hide` (the utility that actually exists).
  - **Search: removed `autoFocus`** on the landing search bar — it was forcing the
    focused/suggestions state open on every page load.
  - **Search: fixed search-bar width.** It was capped at `max-w-[1200]` while the chip row
    and category grid spanned the full ~1622px content column — visibly misaligned. Now
    `w-full`, matching the rest of the column.
  - **Search: wired `RecentSearchesSection`/`TrendingSearchesSection`** (previously unused
    imports, [[open-questions]] #21) as a focus-triggered suggestions overlay — shown only
    while the search input is focused and empty, with a dimming backdrop, closed on
    outside-click/Escape/selecting a suggestion. This is what the "click search bar" state in
    the design actually is, per a screenshot the user supplied.
  - **Search: category tiles + recommended posters now scale on hover** (`GenreCard`,
    `PosterCard` — neither had a hover affordance before).
  - **Search: nav search icon turns gold when active**, matching the other nav items'
    existing active-state treatment.
  - **Search: "Recommended" grid bumped from 6→8 items + a working "See More"** (was a
    visually-uneven 4+2 partial row; 8 gives two full rows of 4, and "See More" now reveals
    the next 8 of the 18 available `recommended` items rather than being a no-op — real data
    was already sitting unused, unlike the Shorts feed's genuinely-exhausted "See More").
  - Fixed [[open-questions]] #21 (closed) — see [[search]] implementation notes.

## 2026-07-16 (p.m.)
- **Built Shorts Player (desktop), fixed two Search landing bugs, repo-wide comment cleanup.**
- **Shorts Player**: wiki claimed a mobile player was built and verified 2026-06-08 — user
  reported (and this session confirmed) that's stale: `ShortsPage.jsx` is desktop,
  `ShortsPlayerPage.jsx` didn't exist, `/shorts/:id` was commented out in App.jsx. Built
  [ShortsPlayerPage](../src/pages/ShortsPlayerPage.jsx) + 4 new sections (`ReelPlayerCard`,
  `ReelActionRail`, `ReelCaptionPanel`, `ReelNavArrows`) per a corrected layout from a fresh
  screenshot (video card centered, action rail + nav arrows as separate columns to its
  right, gesture-hint icons on the paused center button). Uncommented the route. Nav
  wraps around the finite `reels` list (commented for a future disable-at-edges change once
  a real stream exists); "Watch full episode" is a no-op placeholder like the feed's "See
  More". Found and fixed a real bug during manual browser verification: `resolveReel(id)`
  builds a fresh object per call, and the page's reset `useEffect` depended on that unstable
  reference — it was re-firing after every render (including the one from clicking Play) and
  immediately resetting `playing` back to `false`. Fixed with `useMemo(() => resolveReel(id),
  [id])`. See [[shorts-reels]] for full stale-claim writeup.
- **Search landing page**: user supplied a screenshot showing the real landing design, which
  didn't match what shipped 2026-07-15 — the genre-filter-chips row (Composition list always
  named it) was never built, and the category grid rendered twice (`BrowseCategoriesSection`
  + a duplicate inline grid) using the wrong fixture (`browseCategories`, Horror/Documentary/
  AI Clips/Animation, 4 shipped assets) instead of `homeFixtures.genres` (Action/Comedy/Drama/
  Sci-Fi/Kids & Family — what the screenshot actually shows). Added `GenreChipsRow` +
  `searchFixtures.genreChips` (hand-authored labels, no Figma source), pointed
  `BrowseCategoriesSection` at `homeFixtures.genres`, removed the duplicate section. Left
  `browseCategories` fixture unused per user's call. Logged [[open-questions]] #21: found
  `RecentSearchesSection`/`TrendingSearchesSection` imported but never rendered in the
  landing JSX — separate pre-existing gap, not touched. See [[search]] stale note.
- **Comment cleanup pass** across `src/` (pages, components, data/api/store/utils — ~56
  files): stripped verbose JSDoc preambles (component name restated, "DESKTOP", Figma node
  IDs, prop lists mirroring destructured params) down to nothing or one line; kept the
  genuinely non-obvious ones (MainLayout's reveal-footer CSS trick, ShortsAvatarRail's
  overflow-x/y padding workaround, PosterCard's rank-alternation math, GenreCard's
  off-token radius note, flagged assumptions/TODOs). Verified comment-only (no logic/JSX
  changes) via diff review during the pass.
- `npm run build` ✓ (251 modules, no errors) after all of the above. Manually verified both
  screens in-browser (play/pause toggle, like/save toggle, share, nav-arrow wrap-around,
  genre-chip click → committed search, single category section rendering) — see this
  session's transcript for the click-through.
- Updated [[shorts-reels]] (rewritten), [[search]], [[open-questions]] #20/#21, [[index]].

## 2026-07-16
- **Verified + finished wiring Search and Live TV/EPG** (both built by a concurrent session
  on 2026-07-15, mid-edit when this session started — see that day's log entry). Found the
  2026-07-15 entry claimed [[search-results]], [[search-edge-cases]], [[live-tv-epg]],
  [[live-tv-filters]] were updated with implementation notes; they weren't (still showed
  `🔗 EXTERNAL`/stub, empty implementation notes) — backfilled all four now, plus [[index]]'s
  status line and [[open-questions]] #3/#5/#6/#7 (route map, recent-searches persistence,
  min-query-length, "did you mean" source), which the same entry described as decided but
  never actually closed in the table.
- Also collided directly with the concurrent session mid-edit on `searchFixtures.js` — my
  first append landed while theirs was already writing the richer version (dedicated
  `search-recommended-poster-*` / `search-browse-by-categories-*` / `results-featured-
  result-*` assets I hadn't discovered yet), producing duplicate import declarations.
  Rewrote the file clean against their version rather than my own draft — theirs was more
  complete.
- **Routing gaps closed:** `/search?q=...` and `/live?category=...` were documented but not
  actually implemented — both pages held query/category as local state only, no URL sync.
  Added `useSearchParams` to both (replace-not-push): [SearchPage](../src/pages/SearchPage.jsx)
  round-trips `?q=`, [LiveTvPage](../src/pages/LiveTvPage.jsx) round-trips `?category=`
  (omitted entirely for "All").
- Added `api/search.js` + `api/liveTv.js` — both pages' doc comments already referenced
  these (`TODO: missing API`, mirroring `api/home.js`'s pattern) but the files didn't exist.
- `npm run build` ✓ after all of the above (231 modules, no errors).

## 2026-07-15
- **Search + Live TV / EPG built (desktop).** Both were `🔗 EXTERNAL` design-only stubs;
  now implemented and routed (`/search`, `/live`). No API docs for either yet — both read
  from local fixtures (`src/data/searchFixtures.js`, `src/data/liveTvFixtures.js`) pending
  `/api/search` and `/api/liveTv` (see [[api-contract]], still a stub).
  - **Search**: landing (recent/localStorage + trending + browse-by-categories +
    recommended), results (best-result hero + All/Movies/TV Shows/TV Channels tabs),
    and edge cases (short-query hint, debounced loading, zero results + "did you mean",
    network error — demo-triggered by typing "offline", no real network call exists to
    fail against — and an "Added to My Stuff" toast) collapsed into one stateful screen
    rather than separate routes, since the Figma sheet is one continuous flow. Catalog
    reuses Home's fixtures for real titles + the dedicated `search-recommended-poster-*`
    (18) assets with placeholder titles (filenames carry no copy). Only 4
    `browse-by-categories` assets shipped (Horror/Documentary/AI Clips/Animation) — same
    partial-asset situation as the Shorts rail.
  - **Live TV / EPG**: category tabs (All + the 5 filter categories) + featured live
    program hero + on-air-today schedule (Coming Up / Earlier Today as one toggled
    component, per the existing wiki note) + live channels sidebar. Asset coverage here
    is thin — only ONE dedicated EPG image shipped (the featured-program match graphic);
    schedule/sidebar thumbnails reuse Home's `live-on-tv-now-*` / `browse-live-channels-*`
    images, channel names are placeholder copy. Category filtering only has real data for
    "Sport" (the shipped fixture); other categories currently render an empty-state
    message rather than fabricating more schedule data.
  - Wired `Navbar`'s search icon → `/search` (was decorative, no `onClick`).
  - `npm run build` ✓ after all of the above.
  - Note: found a concurrent Claude Code session mid-refactor on this repo (Shorts/Reels
    work, `MainLayout revealFooter` prop, mobile top-bar/bottom-nav split). Treated disk
    state as ground truth at start of this session; didn't touch Shorts files.
  - Updated [[search]], [[search-results]], [[search-edge-cases]], [[live-tv-epg]],
    [[live-tv-filters]] status + implementation notes; updated [[index]].

## 2026-06-08 (p.m.) — pivot to mobile
- **Reels rebuilt mobile-only.** User clarified the product is mobile-first and shared mobile design screenshots (feed, player, skeleton). Deleted the 13 desktop reels files built earlier today (2 pages + 11 sections + 2 cards). Kept slice/api/fixtures. New mobile chrome: `MobileTopBar` (feed/player variants), `MobileBottomNav` (5 tabs, `useLocation`-driven active state). New mobile reels components under `src/components/sections/shorts/`: `MobileShortsFilterChips`, `MobileShortsRail`, `MobileLiveReelHero`, `MobileTrendingNowSection`, `MobileForYouGrid`, `MobileReelActionRail`, `MobileReelInfoOverlay`, `MobileShortsSkeleton`. New cards: `MobileShortGridTile`, `MobileTrendingCard`. Pages wrap in `max-w-[480px] mx-auto` for phone-shaped column on desktop browsers. `/shorts?loading=1` previews the skeleton. `npm run build` passes (3.05s, 312.38 kB JS / 48.76 kB CSS gzipped). Logged [[open-questions]] #20 — mobile Reels Figma node IDs not yet ingested; pilot built from screenshots only.

## 2026-06-08
- **Built Shorts/Reels desktop screens** (Figma 2883:10025 feed, 2883:10145 player, 2883:10252 incoming-reel). `npm run build` passes (5.04s, 311.73 kB JS / 45.83 kB CSS gzipped). New files: [ShortsPage](../src/pages/ShortsPage.jsx), [ShortsPlayerPage](../src/pages/ShortsPlayerPage.jsx), 8 sections under `src/components/sections/shorts/`, 2 cards (`ShortGridTile`, `TrendingNowItem`), `shortsSlice`, `api/shorts.js` stub, `data/shortsFixtures.js`. Wired routes `/shorts` and `/shorts/:id` in App.jsx; reducer in store.js; Navbar converted to `<Link>` with `useLocation`-driven active state (Shorts stays active on player route). Player: ↑/↓ keys + nav arrows iterate `reels`, `Esc` returns to feed, IncomingReel peek slides in on next-advance. `reel-action-rail` ships without the `comment` action per 2026-06-05 design removal. Updated [[shorts-reels]] → `✅ VERIFIED`. Pilot still uses local fixtures (API stub flags `// TODO: missing API`).

## 2026-06-05
- **Re-ingested Figma sheet — Mobile designs added.** Sheet `1XPIbfGc…vsa4` grew: tab 1 45→69 screen frames, tab 2 168→199 component frames. New rows are all **Mobile** (Home, Video Playing, Search variants + a mobile loading skeleton). Appended verbatim to [[figma-frames]] append log (raw kept immutable; typos preserved). New mobile-only components: `top-app-bar`, `category-tabs`, `bottom-nav-bar`, `afriplay-bundle-promo`, `upcoming-tv-shows-section`. Flagged stale "desktop-only" claims in [[design-system]]; narrowed [[open-questions]] #2 (mobile now exists, tablet + responsive strategy still open); added #18 (sheet typos) + #19 (mobile-only components scope). Updated [[components]], [[home]], [[index]].
- **Comment / reel-comment components removed from design.** Verified deleted in live Figma (`2883:10373`, `2883:10572`, `2883:10732` + their components; `comment` action also dropped from `reel-action-rail`). Per user, annotated the source sheet **non-destructively**: "Removal Status" column = `REMOVED 2026-06-05` (Tab 1 F14–16, Tab 2 G29–50) + strikethrough (Tab 2; Tab 1 name has `/` the format API rejects). Rows kept, not deleted. Wiki: tombstoned [[shorts-comments]], flagged removed components in [[components]], closed [[open-questions]] #4 as moot, appended [[figma-frames]] log 2026-06-05 (b).
- **Pilot build (desktop Home `2883:4087`) in progress** — unaffected by the mobile additions or comment removal; continuing.

## 2026-06-04
- **Wiki scaffold created.** Three layers (`raw/`, `pages/`, hub).
- Ingested Figma sheet `1XPIbfGcQiqqbn5eEoJEdo5bgyv65yS6DJaKomi0vsa4` → [[figma-frames]] (45 screen + 168 component frames, verbatim, immutable).
- Wrote 8 screen pages (split per design group): [[home]], [[shorts-reels]], [[shorts-comments]], [[search]], [[search-results]], [[search-edge-cases]], [[live-tv-epg]], [[live-tv-filters]].
- Wrote 3 cross-cutting pages: [[design-system]], [[components]], [[api-contract]] + [[conventions]], [[open-questions]].
- Wrote [[CLAUDE]] schema (rules + confidence tags), [[index]] hub, README.
- 9 open questions logged in [[open-questions]] (stack, routes, mobile scope, auth, search params, API).
- **Pending sources:** WhatsApp brief + API docs (not yet provided) → will land in `raw/` and feed [[api-contract]].
- **Asset pipeline established** (commit `05dea9f`). Git LFS tracks png/jpg/webp/gif/pdf; SVGs stay normal git (<3KB, 20KB cutoff). `/assets` buckets: icons/images/logos/illustrations. `scripts/process-assets.mjs` renames to `<screen>-<section>-<role>`, runs svgo (viewBox preserved, never cropped) + PNG→WebP (q82 photos, lossless logos/glows), dedups byte-identical files. 258 source files (65MB) → 193 unique (9.2MB, 86% smaller), 65 deduped, 0 flags. Fresh clone w/o binaries = ~1MB (`git lfs pull` to hydrate). Convention: [[asset-naming]] + `/assets/README.md`. Per-batch mappings in `scripts/mappings/`. **Rule for all future work: reference `./assets/...` directly — never re-export/guess from Figma MCP (it crops vectors).**
- **Design tokens extracted from Figma** (file `VEIpoe6WtZjzxqzFSN5Agt`, via MCP `get_variable_defs`). Colour/typography/shadow from Variables; spacing & radius node-inferred (no vars). Mirrored Elysium Tours' single-file Tailwind v4 `@theme` structure → scaffolded Vite+React+Tailwind app at repo root, tokens in [src/App.css]. Build verified (`npm run build` ✓). Filled in [[design-system]] with full token tables; logged 8 new Figma inconsistencies in [[open-questions]] (#10–#17): missing gold-7, no spacing/radius vars, skipped spacing names 9/11, SF Pro Text licensing, radius ordering, noise vars, dual gray scales.

## 2026-07-17

- **API docs email re-received, unchanged.** Diffed the re-sent brief against `raw/api-docs.md` — zero differences; appended a dated re-receipt note to the raw file only. [[api-contract]] unaffected.

- **Auth ported from legacy app** (2026-07-17). Legacy `afriplay-ghana-main` auth reused per API brief ("screens not covered by new designs stay unchanged"): operators map (both Ghana operators + global/nigeria), CRM OTP generate/validate, network check (`/cm/api/auth`), Uniqcast login/refresh/logout, geo gate → `/out-of-region`. New files: `src/api/{auth,authApis,account,refreshToken}.js`, `src/utils/{operators,authConstants,setDeviceInCookies,checkUserAllowed,toast,navigationHelpers}.js`, `src/store/slice/authSlice.js`, `src/pages/auth/*` (SelectNetwork/SignUp/SignIn/OtpVerification/ResetPassword/OutOfRegion, revamp UI via AuthShell/AuthInput/OtpInput), `ProtectedRoute` wrapping index//live//search//shorts. Legacy bugs fixed in port: inverted email validation, stale module-load cookie reads, per-call interceptor stacking (now single global 401→refresh), device cookie path mismatch. Deps added: axios, universal-cookie, uuid, ua-parser-js.

- **Auth verified end-to-end on device (2026-07-17).** MTN mobile data required: CRM `/cm/api/auth` validates the caller's IP against operator network ranges (off-network → valid=false, "IP4 not in any ip4 network range"). Uniqcast login rate-limits (429, code 4290, `details.timeout` = lockout-end unix ts) after repeated failures. Full flow confirmed: network check → OTP → signup → reset-password → login. Navbar now auth-aware (signed-out: Sign In/Up; signed-in: search/bell/avatar + Profile/Log Out dropdown). Auth pages use legacy Cloudinary backdrop. Open question for Monday: intended prod behaviour for wifi/broadband users who can't pass the IP network check.

- **Landing page added (2026-07-17).** Public `/` now renders `LandingPage` (ported from legacy landing.js): hero + Trending/Recently Added/Binge Worthy teaser rails + FAQ accordion (copy verbatim from legacy Faq.js, restyled with revamp tokens in `sections/landing/FaqSection`). Authed users redirect `/` → `/home`; HomePage moved to protected `/home`; navbar Home item updated; `*` → `/`. Sends legacy 'visit' log + sets device cookies on mount.

- **Subscriptions ported from legacy (2026-07-17).** Packages are STATIC client data (`src/data/subscriptionsData.js`, no packages API); purchase = CRM `POST /cm/api/purchase/?operator_uid=` (`Password` header) → `redirect_url` operator billing page (no polling); cancel = same endpoint `method=delete` then `method=update`; history/entitlement = `GET /cm/api/orders/?...&status=Active` → `premiumSub` (localStorage-cached, via `checkActiveSubscription`). Plan IDs are per-operator (mtn/other), daily plans nest auto-renewal/on-demand ids. New: `store/slice/subscriptionSlice`, `api/subscriptions.js`, `utils/activeSubs.js`, `pages/Subscriptions{,History}Page`, `sections/subscriptions/{SubscriptionCard,SubscriptionModal}`. Routes protected. Navbar Get Bundle: authed → /subscriptions, else → /signin (useHandleNavigation, honours bypass). Legacy `initGetPurchases` NOT ported (broken: hardcoded subscriber). `premiumSub` gating for playback still to wire when watch page is built.

- **Content APIs wired per brief-over-legacy (2026-07-17).** Read legacy `fetchMoviesApi.js`/`channels.js`; distilled integration map into [[api-contract]]. New `api/client.js` (call-time token, packages cache); real `api/{home,liveTv,search,shorts}.js` per brief (banners user-scoped, Search V3 global, rails/vertical_trailer, CRM dashboard_categories). Response shapes ⚠ unverified (VPN) — rails fall back to fixtures. New dev flag `VITE_USE_FIXTURES` (design-review mode: thunks no-op, fixture assets render); `utils/devFlags.js`.

## 2026-07-20

- **Shorts player: YouTube-Shorts-style slide transition** between reels (wheel/keys/
  arrows/auto-advance all route through it): `goToOffset` no longer navigates directly —
  it arms a `slide` state; the current card + the incoming reel's still frame ride one
  track that translates a full card height (300ms ease-out, double-rAF so the start
  frame paints), route swaps on the track's own `transitionend` (guarded — the event
  bubbles from the play button's opacity fades) with a 500ms settle fallback. Rail +
  caption fade during the slide. `PLAYER_WIDTH` exported from ReelPlayerCard to size
  the clip viewport. `npm run build` ✓.

- **Landing CTAs auth-gated** (posters + hero Watch Now / My Stuff): all funnel through
  `useHandleNavigation` → signed out: destination saved, then **/select-network directly
  when no operator** (legacy went to /signin first and let its mount effect bounce — a
  visible flash; fixed in the revamp) else /signin. **Legacy gap fixed: `redirectTo` was
  stored but never consumed** (legacy signInPage destructured it and did nothing) — new
  `consumePostLoginDestination()` in navigationHelpers reads+clears it and all four
  post-login `window.location.href = "/"` sites in api/auth.js now honour it, sanitized
  (same-origin path only, no `//`, auth pages excluded so a stale intent can't bounce a
  fresh login back into auth). HeroSection gained optional `onWatchNow`/`onMyStuff` props
  (no behaviour change on /home). Destination is /home until details pages exist
  (comment in LandingPage; `contentId` is already on the mapped items). `npm run build` ✓.

- **Landing page wired to real content** (was fixtures): the Uniqcast Client API is NOT
  public (403 unauthenticated; images accessKey doesn't unlock content endpoints — 405),
  but legacy sourced landing from the **public CRM client endpoint**
  `GET {CM_BASE}/api/client/?operator_uid=…&mode=web` — no auth, banners + rails inline
  under `data.landing_page` (verified live: 10 banners; categories `trending` 20 /
  `recentlyadded` 20 / `Bingeworthy` 13 — uid casing drift, matched case-insensitively).
  New [api/landing.js](../src/api/landing.js) (`fetchLandingContent`, honours
  `VITE_USE_FIXTURES`, operator = selected → `VITE_DEFAULT_OPERATOR` → afriplaymtnghana);
  LandingPage keeps fixtures as loading/failure fallback. Banners carry no title art —
  HeroSection already falls back to the text title. Image ids resolve via the public
  `imageUrl()` accessKey endpoint (spot-checked 200s). `npm run build` ✓.

- **Session summary dir added.** New `wiki/sessions/` layer: per-session pattern digests for future sessions. First entry: [sessions/2026-07-17-auth-subscriptions-api-integration.md] (auth port, subscriptions, API integration quirks, working agreements, gh-push pattern). Indexed in [[index]].

## 2026-07-28

- **Playwright MCP verification adopted** (MangoTV pattern): `playwright` MCP server
  registered in the project config (`claude mcp add playwright -- npx -y
  @playwright/mcp@latest`); new [[debugging-workflow]] page distills Mango's
  methodology — instrumentation-first console logs, the navigate→console→screenshot→
  Figma-compare loop, 390/768/1440/1920×966 viewport matrix, baseline sweeps, and
  concrete-observation logging. Not a test suite: Claude drives the browser. Tools load
  on the NEXT session start; from then on sessions verify changes in-browser directly.

## 2026-07-21

- **Details + Watch pages built** (legacy workflow per the brief's "screens without new
  designs stay unchanged" rule; revamp UI). New `api/details.js` (user movie details,
  series details w/ seasons, episode info, trailers — type now an explicit arg, legacy
  inferred from pathname — playout links, bookmarks GET/PUT/DELETE, related, play log),
  `client.js` gained clientPut/clientDelete. Pages: `/movie/:id` + `/series/:id`
  (DetailsHero: backdrop + 2:3 poster + Show More synopsis clamp ≥220 chars; series:
  season stepper + episode rows — legacy PLAY-targets-LAST-episode bug fixed to first)
  and `/watch/:type/:id` owning ALL subscription edge cases: premiumSub → playout (HLS
  via hls.js), unsub+trailer → plays free, unsub+no-trailer → "Trailer Was Not Found",
  unsub watch → Subscribe → /subscriptions, live → no seek; resume from bookmark,
  progress PUT every 15s/pause/end, CRM play log. Wired: homepage poster rails (API
  items only — fixtures no-op), More Like This, Afrishorts player "Watch full
  movie/episode" (label follows contentType) + avatar "+" → details (brief). Live-
  verified fixes: movie details ship `image_store_id` (no `images` map like series) —
  fallback chain covers image_id/image_store_id/movie_image_stores; `related` +
  `?packages=`; movie `related` spelling still 400s both ways `❓` (Monday list —
  series works). `npm run build` ✓.

- **Live TV wired to API.** `fetchLiveTvContent` in `api/liveTv.js` now dispatches into a new
  `liveTvSlice` (channels V2 + per-channel details for logos, categories/channels tabs, EPG
  grid/lite mapped to featured/live-now/earlier/upcoming shapes). LiveTvPage falls back to
  `liveTvFixtures` per field, HomePage pattern. EPG show field names are defensive guesses
  (`⚠ ASSUMPTION`) — verify via dev `[api]` sample logs on MTN network. `npm run build` ✓.
- **Shorts player pinned to top HLS rendition.** `ReelPlayerCard`: `capLevelToPlayerSize:false`
  + lock `hls.currentLevel` to highest on MANIFEST_PARSED (Safari native path can't be forced).
- **Homepage hero trailer (legacy port).** `fetchTrailer` (vod/trailers movies|episodes → data.url)
  + `HeroTrailer` background video in HeroSection: image until canplay, muted start + toggle,
  scroll-pause, error/end fallback (legacy DynamicBanner/BannerBackground logic, revamp UI).
  Rotation holds while a trailer plays; advances on end. HLS-aware (hls.js, top rendition).
- **Live TV skeleton gate.** LiveTvPage now gates on `loaders.liveTv` → `PageSkeleton hero={false}`;
  `fetchLiveTvContent` early-outs dispatch `fetchLiveTvSuccess({})` to clear the loader (home
  pattern), and the preselected sidebar channel id resyncs when API channels replace fixtures.
- **Shorts feed page wired to API.** ShortsPage now dispatches `fetchShortsContent` → shorts slice
  (rail categories → dynamic filter chips; rail content → avatar rail 15 / grid 24, mapped via
  `toShortCard` with `views: ""` per the brief's no-counts rule — fixtures keep their views).
  Clicks route through `openAfrishortsPlayer` in API mode. Early-outs clear the loader
  (fixtures = final). Dev `[api]` shape logs added for rail categories/content (spec VPN-only).
  LiveReelBanner + Trending Now stay fixtures — no endpoint in brief.
- **Shorts rail shapes verified live.** Rail endpoints need `?packages=` (code 1034). Content rows
  nest {id, heading_image_id, content:[items]}; items carry {id, uid, type, title, image_id,
  preview_image_id, year, critics_rating}. `toShortCard` now keys contentType off `item.type`;
  discovery logs stripped. Page confirmed rendering real categories/posters, no counts on API tiles.
- **Shorts page skeleton.** New ShortsSkeleton (heading/chips/avatar circles/brick grid/sidebar,
  fluid sizes matching the real layout); ShortsPage gates on `loaders.shorts`.
- **Global ScrollToTop.** Route (pathname) changes now reset scroll app-wide via
  components/shared/ScrollToTop in App.jsx; query-only changes (Live TV ?category) keep position.
  Per-page scrollTo(0,0) effects are now redundant (left in place, harmless).
- **Profile page (legacy port).** New /profile route + ProfilePage (My Account left nav:
  Profile/Devices/Support/FAQs — legacy profile.js logic, revamp UI; Watchlist tab dropped, lives
  on Home). api/account.js gains getProfile/updateProfile (CRM subscriber), fetchUserDevices/
  deleteUserDevice (client v1 devices), fetchFaqs (CRM faq). Navbar dropdown Profile now links
  /profile (was dead /my-stuff → bounced home). ⚠ device/faq row shapes defensive, unverified.
- **Hero height viewport cap.** HeroSection (and PageSkeleton hero) height is now
  min(1117/1728*vw, 100vh): Figma aspect on normal screens, capped on short/wide desktops so the
  bottom-anchored banner details stay in view; object-cover backdrop absorbs the crop.
- **Home hero CTAs wired.** Watch Now: movie → /watch/movie/{content_id} (watch page owns the
  premiumSub gate), series → /series/{id} (per-episode playback). My Stuff: optimistic movie
  bookmark via updateWatchlist ("In My Stuff" label), series → details. Fixture slides no-op.
- **My Stuff page (legacy Watchlist port).** /my-stuff route + MyStuffPage: full my_content
  bookmark list (fetchWatchlist — Keep Watching enrichment WITHOUT the >=1% filter), poster grid
  with progress bar, per-item Remove (bookmarks DELETE, optimistic), click → details. Navbar
  dropdown gains My Stuff. Hero "My Stuff" adds now surface here even at 0% progress.
- **Bookmark PUT fix (root cause of empty My Stuff/Keep Watching).** UpdateBookmarkRequest.name
  must be a STRING - numeric id 400'd, so no bookmark ever wrote (watch progress included).
  details.js now sends String(id). Verified live 2026-07-21.
- **Bookmark profile scoping fix.** All bookmark calls (PUT/GET/DELETE) now send ?profile=
  (afri_profile_id, default 1) - MangoTV content.js pattern. Without it the ok'd write landed
  outside the profile my_content?profile_id reads, so My Stuff/Keep Watching stayed empty.
- **Nav: "Tv Channels" removed.** Redundant with Live Tv (UI ticket). Navbar item + dead
  /tv-channels route placeholder dropped. Search's "TV Channels" results tab kept (different
  context - channel result type per brief).
- **Movies page (legacy movies.js flow, brief data).** /movies route + MoviesPage + moviesSlice +
  fetchMoviesPageContent: ALL VOD categories as rails (Categories V2/V3 + vod/content - brief
  supersedes legacy hardcoded rail names), genre tabs from v1/genres filtering the user movies
  list into a poster grid (legacy GenreMovies logic), hero spotlight from recently-added with
  background trailer (Home pattern). Fixture rails fallback; PageSkeleton gate.
- **Landing mobile hero matches Home.** LandingPage now renders MobileHero below md and the
  desktop HeroSection at md+ (mirrors HomePage split) - previously showed the desktop hero on
  mobile. MobileHero gained optional onWatchNow/onMyStuff (landing funnels both into auth via
  requireAuth); Home still passes none -> keeps its UI-only play toggle.
- **MobileTopBar auth-aware.** "app" variant now branches on isAuthenticatedUser (honours
  VITE_BYPASS_AUTH), mirroring desktop Navbar: signed-out shows log-in icon -> /signin (no bell/
  avatar); signed-in shows bell + avatar with a working account dropdown (Profile/My Stuff/
  Subscription History/Log Out) - previously the avatar rendered unconditionally and was a no-op.
- **AuthShell mobile sizing.** Card/title/subtitle now scale on the 390 mobile comp (--mvw) below
  md, 1728 (--vw) at md+ - previously --vw's 768 floor rendered the card ~230px on phones.
  NOTE: inner auth-page controls (network buttons, AuthInput) still use --vw; small on mobile.
- **Auth pages mobile typography.** AuthInput, Continue/network buttons, and helper links across
  SignIn/SignUp/Reset/SelectNetwork now scale on --mvw below md (were --vw -> tiny on phones,
  clashing with the --mvw AuthShell heading). Buttons bumped to ~17px padding / 16px text mobile.
- **OTP page mobile sizing.** OtpInput boxes now flex-1/aspect-square with --mvw radius+text below md
  (were --vw size-56 -> ~25px squares on phones); OTP page gap + Done button scaled to --mvw too.
- **Landing mobile typography.** FaqSection (question/answer/+ /padding), PosterCard inner
  (title/metadata scaled, action buttons hidden below md), and SectionHeader titles now use
  max-md --mvw overrides - were --vw (768 floor -> ~6-13px on phones). PosterCard/SectionHeader
  changes ripple to Home/Movies rails too. Desktop untouched (max-md only).
- **Movie/Series details mobile responsive.** DetailsHero stacks poster-over-text centred with
  --mvw fonts/spacing below md (was fixed --vw horizontal row -> overflow + tiny text); action
  buttons and the series Episodes list + season stepper + More Like This gutter all got max-md
  --mvw overrides. Desktop untouched (max-md only).
- **Profile page mobile responsive (legacy pattern).** ProfilePage follows legacy profile.scss
  <768 layout: below md the account column stacks, left nav becomes a horizontal scrolling tab
  strip, content full-width; ProfileTab avatar/name/inputs/save + shared inputClass scaled on
  --mvw; name inputs stack. Desktop untouched (max-md only).
- **MobileHero spacing to Figma.** Content column lifted off the hero bottom (pb-28) so the CTA
  clears the edge; poster→text gap 18, text block gap 12, title art h-60, CTA row lifted (mt-6,
  gap-10) with a wider Watch Now pill (h-40 px-22) + matching h-40 add button.
- **MobileHero background trailer.** Exported HeroTrailer from HeroSection; MobileHero now renders
  it inside the circular poster (autoplays muted, image until canplay) driven by trailerUrl/muted,
  matching the desktop hero. HomePage passes activeTrailer/heroMuted to MobileHero too.
- **MobileHero trailer takes over full hero bg.** HeroTrailer now full-bleed in MobileHero (not
  inside the poster circle); new onActiveChange fires when it can play -> poster circle hides and
  the trailer fills the whole hero background (matches desktop). Text/CTA stay over it.
- **MobileHero mute/unmute.** Added the speaker toggle (shown only while the trailer is active),
  top-right on the chips row, wired to onToggleMute; HomePage passes it (heroMuted toggle) to
  MobileHero, matching the desktop hero.

## 2026-07-30 — Shorts-page banner: endpoint identified by live probe
- **Question:** the mobile Shorts feed banner renders a fixture asset (`liveReelPreview`); which endpoint
  serves the real one? **Brief (`raw/api-docs.md`) is silent** — its REELS/Shorts section covers only
  categories, rail content, rounded list, grid, playback, details nav, profile icon and controls.
- **Method:** live probe (no VPN needed). Playwright + system Edge with a persistent profile, waited for
  the user's OTP login, then fetched candidate endpoints from inside the authenticated page.
  Script + raw JSON kept in the session scratchpad (`probe-banners.js`, `probe-result.json`).
- **Answer:** the selected rail category's **`heading_image_id`**, via `imageUrl()`. Served by both
  `GET /v3/{ouid}/categories/rail?packages=` (all categories) and
  `GET /v1/{ouid}/categories/rail/content?packages=&categories={id}` (per selected rail; rows are
  `{id, heading_image_id, content:[…]}`). For You/Trending/Sports → 332952/332953/332954; all three
  resolve on the image CDN, and For You's is 1248×699 (16:9) operator promo artwork — uid `contentCover`.
- **Ruled out:** the Banners API. `users/{user_id}/banners` returns a single homepage VOD promo
  (`uid:"drifted"`), unrelated to shorts.
- **Bonus gotcha recorded:** adding `?device_class=` to the banners call returns `data: []` on this
  operator, despite MangoTV's `api.md` marking it REQUIRED (`device_class` is an *array* on the row).
  Current code correctly omits it — don't "fix" it.
- Distilled into [[api-contract]] (Banners + new "Shorts-page banner" section + rail shapes);
  raised [[open-questions]] #23 (the banner's LIVE badge / handle / views text has no API source).

## 2026-07-30 (b) — Shorts feed banner + Trending Now wired to the API
Both were fixture-only holdouts justified as "no endpoint in the brief". Live probe (see the
2026-07-30 entry above, plus a second pass over all three rails) resolved both.

- **Banner** ← the selected rail category's `heading_image_id` via `imageUrl()`, preferring the
  content row's copy and falling back to the category record.
- **Trending Now** ← rail content items through the existing `toShortCard`, ranked by array order.
  Sourced from the **dedicated Trending rail** (`⚠️ ASSUMPTION` — For You and Trending return
  identical content on this operator, so the choice isn't empirically decidable; see
  [[open-questions]] #24). Adds one extra request, skipped when Trending is already the active rail.
- Both now flow `api/shorts.js` → `shortsSlice.liveReelPreview` / `.trendingNow` → **both**
  `ShortsPage` (desktop sidebar) and `MobileShortsPage`. Fixtures remain the fallback.
- **Invented chrome removed in API mode.** The banner's LIVE badge / `@AfriSportsHQ` / view count have
  no API source, so they're suppressed rather than faked (`LiveReelBanner` gained `showLive`); the
  production app shows the card clean too. Fixture mode still renders the designed overlay.
- **Empty-label fixes:** API content carries no duration/view count (brief ignores counts), so the
  mobile grid tiles and Trending tiles were rendering a bare `" views"` and an empty duration pill.
  Both labels are now conditional.
- **Queue-seeding bug fixed:** every click seeded the player queue from `forYouGrid`, so a Trending
  item absent from that list would navigate to `/shorts/:id` and immediately bounce back out (the
  player redirects when its id isn't in the queue). Clicks now seed from the list they came from.
- Checked while probing, **not** a bug: `vertical_trailer` rows *do* carry `content_id` + `type`, so
  the existing id-matching in `openAfrishortsPlayer` resolves real HLS URLs (20/20 for rail one).

Touched `api/shorts.js`, `ShortsPage.jsx`, `MobileShortsPage.jsx`, `LiveReelBanner.jsx`,
`TrendingNowSidebar.jsx`. Distilled into [[api-contract]], [[shorts-reels]]; questions #23 (narrowed)
and #24 (new) in [[open-questions]].
- **Live TV desktop: scroll-to-featured on channel select (parity with mobile).** Desktop
  LiveTvPage now mirrors MobileLiveTvPage's stageChannel — sidebar/schedule channel clicks
  scrollIntoView the featured panel (featuredRef + scroll-mt to clear the fixed navbar), so the
  retargeted panel isn't updated off-screen when the user is scrolled deep in the list.
- **Live TV: On Air Today rows stage channel too.** ScheduleRow (Earlier/Coming Up) is now
  clickable (Replay/Remind button stopPropagation-guarded) and, with the live cards, routes
  through onOpenChannel; LiveTvPage resolves the row (by id/channelUid/channel name) to a live
  channel and stageChannel-scrolls the featured panel into view. Falls back to playout if unmatched.

## 2026-07-30 (c) — Mobile top-nav consistency fixed (Playwright audit)
User reported the mobile top nav behaving differently per page. Audited all 15 mobile routes with
Playwright (stubbed session + intercepted API, so no OTP needed) — `scratchpad/audit-topnav.js`,
which lists each route's visible top-region controls and asserts the bell/account dropdowns open.

**Findings (before):**
| routes | top nav | bell | account menu |
|---|---|---|---|
| `/home` `/movies` `/my-stuff` `/notifications` `/profile` `/subscriptions` `/subscription-history` `/movie/:id` `/series/:id` | shared `MobileTopBar` | opens | opens |
| `/shorts` `/live` | own header | **dead (no handler)** | **absent** |
| `/search` `/tv-guide` | **none at all** | absent | absent |
| `/watch/:type/:id` `/shorts/:id` | none — intended (`mobileChrome={false}`) | – | – |

**Root cause:** `mobileTopBar="status"` opts a route out of the shared bar on the assumption the page
renders its own header. `/shorts` and `/live` did, but hand-rolled the control cluster with no
handlers; `/tv-guide` inherited the flag purely by sharing `/live`'s route group and rendered no
header; `/search`'s own top element is a search field, not a header.

**Fix:** extracted `MobileNavActions` (Get Bundle · bell + badge + `NotificationsPanel` · avatar +
account menu · signed-out log-in) from `MobileTopBar`; `/shorts` and `/live` headers now compose it,
`/tv-guide` and `/search` moved to route groups that render the shared bar (`/search` page `pt`
46→62 `--mvw` to clear it). Net **−114 lines** of duplicated markup. `MobileTopBar` "app" is now
logo + `MobileNavActions`. Bell and account also close each other now (they could both be open).

**Re-audit (after):** bell + account open on all 14 non-player routes; no bar/content overlap on any
route (measured); `/watch` unchanged. Distilled into [[components]] (new "Mobile top-nav contract"
with the rule that `mobileTopBar="status"` requires a real self-supplied header).

## 2026-07-30 (d) — Empty duration pill on shorts tiles
User spotted a blank purple pill top-right of every desktop Shorts "For You" tile. It was
`Badge variant="duration"` rendering with no children: `toShortCard` sets `duration: ""` for API
items (which overrides the components' `"0:00"` default param), and three cards rendered the badge
unconditionally — `ShortGridTile` (desktop grid), `ShortCard` (homepage Afrishorts rail) and
`MobileShortGridTile` (currently unused by any page). All three now guard on `duration`.

**Why it's empty, not wrong-valued:** there is no duration for a short anywhere in the API.
`✅ VERIFIED` 2026-07-30 — rail-content items have no duration field, and the `vertical_trailer` POST
returns `{drm, wv_license_proxy_url, url, subtitles, thumbnails, limit_token, isDeeplink, vod_type,
cdn_used, content_id, type}`. Movie/episode `duration` is the full runtime in minutes (MangoTV
`api.md`), i.e. the wrong number for a shorts tile. Raised [[open-questions]] #25.

Verified with the recorded live rail payloads: `/shorts` now renders 0 duration pills (was 20 empty
ones), while `/home`'s fixture rail still shows real "0:45"/"1:00" values — the guard doesn't affect
design/fixture mode.

### 2026-07-30 (d, addendum) — duration hunt: no endpoint has it
Swept 5 endpoints and recursively scanned every response for `/dur|runtime|length|seconds|_time/i`
(`scratchpad/probe-duration.js`, live session). Result: **the only `duration` the API exposes is the
full feature runtime in minutes** (`movies/{id}` → 89 for Drifted; the movies list spans 2–197).
Neither `POST users/{uid}/vertical_trailer` nor `users/{uid}/vod/trailers/movies/{id}` returns a
duration — both are `{drm, wv_license_proxy_url, url, subtitles, thumbnails, limit_token, isDeeplink,
vod_type, cdn_used}` (+`content_id`/`type` on the vertical one). `thumbnails: {start:0,end:5,count:6}`
is a sprite index range, not seconds. `purchase_duration` on packages is a billing period.
So the design's "0:45" pill has no backing field — hiding it is correct. Details in
[[open-questions]] #25.

### 2026-07-30 (d, addendum 2) — where the PLAYER's duration comes from (it's not an endpoint)
The player *does* show a duration, so we traced it: entered `/shorts/15346` with Playwright and
recorded every request (`scratchpad/probe-player-duration.js`).

- `video.duration = 59.88` (readyState 4) — real, correct.
- The **only** JSON request the player makes is `POST users/{uid}/vertical_trailer`, and **no JSON
  response contained a duration**. Everything else is `audio/x-mpegurl` (HLS playlists) and media
  segments (`video/mp4`, `application/octet-stream`).
- So the duration comes from **hls.js parsing the playlist → `video.duration`**, surfaced by
  `ReelPlayerCard`'s `onLoadedMetadata` → `onDuration` → `ShortsPlayerPage.mediaDuration`. Confirms
  [[open-questions]] #25: no endpoint exposes it. The feed grid has no `<video>`, hence no duration —
  it would need the signed URL (one `vertical_trailer` POST) plus a playlist fetch per tile.

**Bug found and fixed while probing:** the player rendered **"0:60"** for the 59.88s short.
`formatSeconds` derived minutes before rounding the seconds remainder, so `Math.round(59.88 % 60)`
gave 60. Rounding the total first fixes it (59.88 → "1:00"). The helper was duplicated verbatim in
`ShortsPlayerPage` and `MobileShortsPlayer`; both now import `utils/formatSeconds.js`.

### 2026-07-30 (d, addendum 3) — CORRECTION: the duration pill IS available; I was wrong
User pushed back with a screenshot of the production mobile app showing durations on its grid tiles
(2:39, 1:30, 2:04, 1:03) and asked how the backend dev manages it without a stream. They were right.

**Answer: it's the movie's `duration` field (minutes) rendered as `H:MM`.** Matched 4/4 against the
screenshot from data already captured: The love I promised her 159 → 2:39, TANWA SAVAGE 90 → 1:30,
Panther 124 → 2:04, Pains of Aliyah 2 63 → 1:03.

**My error:** the earlier sweep *did* find `duration`, and I dismissed it — "that's the full runtime,
not the short's length, so it would be wrong to show". That was a design opinion presented as an
evidence-based conclusion. The operator does show the feature runtime; the pill is a runtime badge,
not a clip length. Both prior addenda stand on the *facts* (no endpoint exposes a vertical-trailer
length; the player reads its own duration from the media) but the recommendation drawn from them was
wrong. `🪦` Treat "no duration source" as STALE.

**Implemented:** `fetchRuntimes()` in `api/shorts.js` builds an id → minutes map from
`users/{user_id}/movies` + `/series` (cached per page-load; rail rows have no duration), joined in
`toShortCard`; new `utils/formatRuntime.js` does minutes → `H:MM` and returns "" for 0/null so the
badge still hides when a title is missing from the listing. Homepage Afrishorts rail fixed the same
way — it was passing `undefined`, so `ShortCard`'s hardcoded `"0:45"` default made **every** API tile
show a fabricated time. Removed the fabricating defaults from all three cards (`"0:45"`/`"0:00"` → `""`).

Verified by replaying the recorded rail + movies payloads: tiles render 1:43, 1:57, 1:05, 1:30, 2:04,
2:30, 2:03, 1:03, 1:46, 2:00 — matching the production app on every overlapping title.
Do NOT confuse `utils/formatRuntime.js` (MINUTES → H:MM, tiles) with `utils/formatSeconds.js`
(SECONDS → m:ss, player playback position).

## 2026-07-30 (e) — Shorts grid tile matched to Figma 4041:27263
User flagged three mismatches: titles should overlay the poster (not sit beneath it), the duration
pill's opacity was wrong, and the title's size/style needed to match — plus truncation where needed.
Pulled the comp via the Figma MCP (Components 5 tall 245×285 / 6 short 245×207) and rewrote
`ShortGridTile` against it.

**Fixed**
- **Title/views now overlay the poster**, bottom-left — previously stacked below it. Text block is
  bottom-anchored (left 16, bottom 20); both tile heights use the same inset, confirmed from the comp
  (tall top 191 + 74-tall block = 20; short top 113 + 74 = 20).
- **Title** 18px `text-lg`/`gray-1`/`line-clamp-1` → **20px semibold, line-height 1.2, `gray-1/95`,
  `line-clamp-2`** with ellipsis (verified rendering "An Extremely Long Nollywood Feature…").
- **Views** → 16px regular, line-height 16, `gray-1/55` (still hidden for API content per the brief).
- **Duration pill** (`Badge` `duration` variant, shared by all three shorts cards): opaque
  `bg-purple-11` + `rounded-md` + 10px text + padding 10/4 → **`bg-surface-purple/60`** (the comp's
  `rgba(31,8,50,0.6)` IS surface-purple `#1f0832` at 60%), `rounded-full`, **12px** semibold, 10/6.
- **Card radius** `rounded-lg` → **20**; **grid gap 24 → 16**; short tile 206.54 → **207**. The gap
  was hardcoded 24 in the JSX while `GRID_GAP` fed the container-width calc — both now 16 and noted
  to stay in step.
- Added the comp's scrim (full-card wash to black/30 + bottom gradient) so white text stays legible
  over bright posters.

**Verified by DOM measurement** at a 1728 viewport (fluid calcs resolve 1:1 to comp px): card
245×285 radius 20px; pill bg at 0.6 alpha, radius 9999, 12px/600, padding 6/10, offsets right 12 /
top 9; title 20px / line-height 24px / 0.95 alpha / clamp 2; text block left 16, bottom 20; column
stride 261 → 16 gaps both axes. Truncation: clientHeight 48 vs scrollHeight 121, clamped.

Spec table + a `🪦 STALE` note on the old styling recorded in [[shorts-reels]].
⚠️ Mobile tiles not covered — the frame is the desktop comp.

## 2026-07-30 (f) — Hero title art: right field name, wrong place — and the operator has none
User: the hero renders "Drifted" as text, yet the mobile app shows the title as art. Investigated
with Playwright + the image CDN (`scratchpad/probe-titleart.js`, `probe-titleart2.js`).

**Two findings, both needed:**
1. **Our lookup was in the wrong place.** `title_art_image_id` is a real field — but it is only
   returned on **VOD category-content rows**, never on the movie/series *detail* record the hero
   enriches from (`movie_image_stores` is `[]` there). So `d.title_art_image_id || storeArt` was
   structurally incapable of resolving. Fixed: build `contentId → title_art_image_id` from the
   content rows already fetched in `fetchHomeContent`, detail fields kept as fallbacks.
2. **…but there is no title art to find.** `title_art_image_id` is `null` for **all 75** items across
   all 10 dashboard categories. So the text fallback is correct behaviour, not a bug — this is a CRM
   content gap. Added a DEV log reporting the populated count.

**What the user is seeing in the mobile app is the poster.** Drifted's poster (`331623`, 544×816) has
"Drifted" in cursive baked into the artwork. The banner's own images carry no text at all —
`banner_image_id` 864×408 and `preview_image_id` 1920×1080, both JPEG with no alpha (fetched and
inspected). There is no separate transparent wordmark asset anywhere in the API.

**Ruled out:** `movies/{id}/image_stores`, `image_stores?movie_id=`, `movies/{id}/images` → all 404;
param variants (`translation`/`image_stores`/`with_images`/`full`) return identical payloads.
**Also noted:** banner image ids churn — banner 698's `banner_image_id` was 331665 in the morning and
333101 later the same day, so never hardcode/cache them.

Open item for the client: upload title art in the CRM, or accept the text title (currently
`text-5xl` = 28px, visually much smaller than the 375×136 art slot it replaces — worth a design call).
Distilled into [[api-contract]] under "Hero title art".

### 2026-07-30 (f, addendum) — title-art fix CONFIRMED by screenshot, plus a white-screen guard
Verified the corrected lookup with a two-pass Playwright run (`scratchpad/verify-titleart.js`) that
replays the real payloads and only varies `title_art_image_id` on the banner's content row:

| pass | `title_art_image_id` | DEV log | hero renders |
|---|---|---|---|
| with-art | 331665 | "title art available for **1 of 1**" | `<img>` **375×136 `object-contain`** (text `<h1>` suppressed) |
| no-art | `null` (as live) | "title art available for **0 of 1**" | text "Drifted" @ 28px, no `<img>` |

So the code path is correct: art resolves when the field is populated, and the live text fallback is
purely the operator's missing content. Screenshots: `titleart-with-art.png` / `titleart-no-art.png`.

**Bug found while building the harness — fixed.** A malformed CRM inbox payload **white-screened
every page**: `api/inbox.js` passes `res.data?.data` straight to `fetchInboxSuccess`, which assigned it
to `state.messages` unvalidated; `selectInboxUnreadCount` then calls `.filter` on it, and that selector
runs in `Navbar` / `MobileNavActions` — i.e. on every route. An object instead of a list took the whole
app down with `state.inbox.messages.filter is not a function`. `inboxSlice` now coerces with
`Array.isArray(payload) ? payload : []`. Regression-tested by serving `{not:"an array"}`: the page
renders fine where it previously blanked.

## 2026-07-30 (g) — Homepage brought in line with the brief (+ why mobile shows more rails)
User compared our homepage with the principal dev's mobile app. Four defects found and fixed, plus
one difference that turned out NOT to be ours.

**Fixed**
1. **Channel-category injection (brief §6–8) was never implemented.** `channelCategories` was fetched
   and only `console.log`'d — those were its only two references. Now resolves the FIRST category from
   CRM (`dashboard_channel_category_id`, with `dashboard_category_id` accepted for the brief's naming
   drift) and the SECOND by `uid === "featured"`, and injects them after the first VOD rail and before
   the last. New shared `fetchLiveChannelCards()` in `api/liveTv.js` maps a channel category to cards
   (logo, name, current EPG programme) — reused by Home's live rail so the mapping isn't duplicated.
2. **Promotional banner (brief §9) was a hardcoded local `GLOTV.svg`.** Now a random pick from the
   banners' `preview_image` values, positioned immediately after the first channel category. Given a
   heading from CRM `secondbanner` ("Recommended"), and its height capped — the source is 1920×1080,
   so `w-full h-auto` rendered it **1622×912**, a wall rather than a promo strip.
3. **"🔴 Live On Tv Now" shipped DUMMY fixture data on every live load** — `liveOnTvNow` was never
   dispatched ("still to wire") and the rail had no API-mode guard. Now real channels + EPG.
4. **"Upcoming TV Shows" likewise rendered fixtures** in API mode — no API source exists for
   "upcoming", so it is now gated to fixture/design mode.

**NOT our bug: the missing "Nolly Special" / "Recommended" rails.** The CRM serves a different config
per mode — see [[api-contract]] "CRM has TWO profiles". Web lists 10 rail ids, the app 13; the extras
are `7527`, `7570`, `7567`. Our homepage faithfully renders what the **web** profile specifies, which
the brief mandates. Fixing this is a CRM content task for the client, not code.

Verified by replaying a 3-VOD-category config through the real page: rendered order is
Afrishorts → VOD-1 → **News & Documentary** (channel cat 1) → **Recommended** (promo banner) →
Genres → VOD-2 → **Featured Channels** (channel cat 2) → VOD-3 → Live On Tv Now → Browse Live
Channels — matching the brief's §5–9 sequence.
- **Mobile shorts player: next-short autoplay + chrome auto-hide.** MobileShortsPlayer video now
  has a ref + play() effect per reel with a muted-retry fallback (iOS blocks unmuted autoplay when
  the slide setTimeout breaks the swipe gesture). Chrome (top bar, chips, caption/CTA/progress,
  swipe hint) auto-hides after 3.5s idle, reveals on any tap/swipe/wheel/reel-change; right action
  rail + video always visible.
- **Hero mute toggle fix.** React does not reliably sync the <video> muted DOM property from the
  attribute prop, so the mute pill did nothing — HeroTrailer now sets video.muted imperatively in
  an effect. HomePage also renders only the active hero (useIsMobile) instead of both, so a single
  trailer video plays (hidden hero was decoding + playing audio → doubled sound on unmute).

## 2026-07-30 (h) — Mobile responsiveness of the shared home cards
User: fonts and nested elements shrink on the horizontal rails on a phone.

**Cause:** `--vw: clamp(768px, 100vw, 1728px)`. Below the 768px floor every
`calc(N/1728*var(--vw))` renders at a flat **0.444×**, so the desktop cards kept their
proportions but their *labels* collapsed — a 16px caption became ~7px, and the LIVE pill's 10px
text ~4px. `PosterCard` already had `max-md:` text overrides on the 390 comp; the other shared
cards only re-scaled their BOX, not their contents.

**Fixed** (all via `max-md:` on the `--mvw` 390 basis, mirroring PosterCard):
- `ContinueCard` (used by Live On Tv Now + both injected channel rails): caption inset/gap/padding,
  title 13px, subtitle 10px, centre play glyph, progress bar height. Titles now truncate.
- `GenreCard`: had **no** mobile treatment at all — card, padding and label (13px, 2-line clamp).
- `ChannelCard`: live dot position/size.
- `Badge` `live` and `duration` variants — shared, so this also fixes the pills on the mobile
  shorts grid and the home Afrishorts rail.

**Radius:** card radii are fixed px (`rounded-[10px]` / `rounded-[20px]`), so on the smaller mobile
card they read as proportionally rounder. Now scaled with the card (Genres 10→~5, Channels 20→~10).
⚠️ My first pass made this *worse* by adding `max-md:rounded-xl` to GenreCard — reverted.

Verified by screenshotting `/home` at 390×844 through the mocked-payload harness.

### 2026-07-30 (h, addendum) — mobile hero circle + what `banner_image_id` actually is
User: on mobile the poster inside the hero circle doesn't fill it.

**Cause — and it resolves the earlier title-art thread.** `banner_image_id` 333101 is **1650×2475**,
a fully **pre-composed portrait mobile hero**: blurred backdrop, the key art ALREADY circle-cropped,
and the "Drifted" cursive title baked in. MobileHero was cover-cropping that into its own 253px
circle → a circle inside a circle, subject small and ringed by blur.

So the cursive "Drifted" the user saw in the production app is **burnt into the banner image**, not a
separate title-art asset — consistent with [[api-contract]] "Hero title art" (`title_art_image_id` is
null for all 75 items and no wordmark asset exists anywhere).

**Fix:** the circle now prefers `slide.previewImage` (`preview_image_id` = the clean 1920×1080
landscape key art) and falls back to `backdrop`. Verified at 320px — the couple fills the circle.
⚠️ If an operator ever ships a pre-composed portrait hero AND no preview image, the fallback will
show the circle-in-circle again; the real answer then is to render such banners full-bleed.
