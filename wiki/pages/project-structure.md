# Project structure

> Where each kind of code lives. Update when a folder is added. `✅ VERIFIED` 2026-10-26.

Stack: React 19 + Vite 8 + React Router 7 + Tailwind 4 (JavaScript/JSX). Redux Toolkit, axios and
hls.js are added in the phase that first needs them. Dev server: `npm run dev` → http://localhost:5180
(`strictPort`, so a stale server makes it fail instead of silently using another port).

```
index.html              page shell; loads src/main.jsx
.env.example            API base URLs → copy to .env.local (gitignored)
src/
  main.jsx              mounts React + router + global CSS
  app/router.jsx        URL → page map (every screen registered here)
  config/operator.js    WONA operator: id 274, uid econetzw, prefix ecozw
  config/apiUrls.js     CLIENT_API_URL / CRM_API_URL from env
  layout/AppLayout.jsx  frame around every page (header/nav), <Outlet/> = current page
  styles/global.css     Tailwind import + @theme design tokens
  features/<area>/      one folder per product area: its page(s), components, API calls, state
    home/HomePage.jsx
    not-found/NotFoundPage.jsx
wiki/                   this knowledge base
```

## Naming
- Feature folders are kebab-case and named after the product area (`live-tv`, `my-stuff`).
- Inside a feature: `<Area>Page.jsx` for the screen, `<area>Api.js` for its API calls,
  `<area>Slice.js` for its Redux state, `components/` for pieces used only there.
- Code used by several features goes in `src/components/` (UI) or `src/lib/` (non-UI helpers).
- File names say what the file does; no generic `utils.js` / `helpers.js` dumping grounds.
