# Project structure

> 2026-10-27: the codebase is the **AfriPlay Ghana revamp code**, re-branded for WONA (deadline-driven
> decision; the from-scratch scaffold of 2026-10-26 was dropped). `✅ VERIFIED` 2026-10-27.

Stack: React 19 + Vite + Redux Toolkit + React Router 6 + Tailwind 4 + axios + hls.js (JavaScript/JSX).
Run: `npm run dev` → http://localhost:5173 (`strictPort`: fails if an old server holds the port).
Dev flags in `.env.local` (gitignored): `VITE_BYPASS_AUTH=true` (skip login), `VITE_USE_FIXTURES=true` (sample data, no API calls).

```
index.html            page shell
src/
  main.jsx            starts React, Redux store, global 401 → token refresh
  App.jsx             every route (URL → page)
  App.css             design tokens (@theme static) + scaling variables (--vw, --mvw)
  api/                every call to the Client API / CRM, one file per area (auth, landing, fetchMoviesApi, details, liveTv, search, shorts, subscriptions, account, inbox)
    client.js         axios setup, token + operator read at call time, imageUrl()
  store/              Redux: store.js + slice/<area>Slice.js (data the API returned)
  pages/              one file per screen (HomePage, WatchPage, LiveTvPage, …; auth/ for sign-in flow)
  components/
    cards/            poster, continue-watching, channel, short cards
    sections/<area>/  bigger blocks per screen (home hero, rails, search results, …)
    shared/           Navbar, MobileTopBar, AmbientBackground, ProtectedRoute, …
    ui/               Button, Badge, Footer, SectionHeader
  layout/MainLayout.jsx  navbar + page + footer frame
  data/               *Fixtures.js sample content (used when VITE_USE_FIXTURES=true or a rail is empty)
  utils/              operators.js (WONA only), authConstants.js, formatting helpers
assets/               icons, images, logos (wona-logo.svg); PNG/JPG/WebP stored with Git LFS
scripts/              Figma asset export/processing
wiki/                 WONA knowledge base; wiki/afriplay-reference/ = AfriPlay's original wiki
```

## WONA changes made to the AfriPlay code
- Single operator: `utils/operators.js` exports `WONA_OPERATOR` (274 / econetzw / ecozw); `getSelectedOperator()` always returns it; `/select-network` redirects to `/signin`; "Change Network" buttons removed.
- Colour tokens renamed to WONA meanings: `prim-gold`→`brand`, `prim-gold-highlight`→`brand-light`, `surface-purple`→`page`, `elevated-surface`→`surface-raised`, `primary-gold-N`→`brand-N`, `purple-N`→`navy-N`, `shadow-gold-glow`→`shadow-brand-glow`; values from [[design-system]]. AfriPlay gold `#c2b801` replaced with `#da1375` in code and SVG icons.
- Logo: `assets/logos/wona-logo.svg` in Navbar, MobileTopBar, Footer (AfriPlay's `scale-x-200` stretch removed; sized to Figma 120×28 nav / 177×42 footer / 84×20 mobile).
- User-facing "AfriPlay"/"Afrishorts" text → "WONA"/"Wona Shorts".
