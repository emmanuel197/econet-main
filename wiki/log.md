# Log

Short record of what was done. Superseded steps were removed on 2026-10-28; git history has the detail.

## 2026-10-26 — Setup
- Repo: `econet-main` (GitHub `emmanuel197/econet-main`, branch `edward`).
- Figma access working; colours, fonts and frame ids recorded in `pages/design-system.md` and `pages/screen-map.md`.

## 2026-10-27 — AfriPlay code, re-skinned as WONA
- Deadline: switched to the AfriPlay code and changed operator, colours, logo and wording to WONA (`pages/project-structure.md`).
- Matched to the WONA Figma, desktop and mobile: navbar, footer, mobile top bar and bottom nav, homepage, search, Live TV, Shorts.
- Kept on purpose (differs from the comps): bell and avatar on mobile (they hold notifications and the account menu); Shorts player 420 wide (open question 14); "gold" in the Shorts spec done in WONA pink.

## 2026-10-28 — Decisions: where there is no WONA design, follow AfriPlay
- User's rule: undesigned screens keep AfriPlay's behaviour but look WONA. Data and API questions go to the PM.
- Decided this way: sign-in is passwordless like AfriPlay (`pages/auth-flow.md`); number sent as typed with the leading 0 (`ecozw0771234567`); same CRM network check; no extra number validation; one bottom nav everywhere (Home, Live Tv, Shorts, Search, More); app bar kept on mobile search; WONA pink replaces AfriPlay gold.
- Undesigned screens (sign-in, OTP, details, watch, profile, subscriptions, notifications, TV guide, Movies) cleaned of AfriPlay purple, wording and MTN contacts. Pink buttons use white text.

## 2026-10-28 — Sample mode fixes
- TV Guide now has sample data. Mobile top bar no longer clips at the top.
- Buttons with no real title behind them (sample hero, Shorts "Watch full…") show a "preview" message instead of doing nothing or opening a broken page. Details pages show a loading skeleton.

## 2026-10-28 — TVOD (rent or buy) — routes `/tvod/…`
- Built from the user's SVG exports (Figma image export was rate-limited). SVGs are gitignored; nothing in the app reads them.
- Home banner "Browse" → `/tvod` → title → access sheet → order summary → card or Mobile Money → result.
- Back goes to the previous screen (`utils/useGoBack.js`).
- No payment API: test outcomes — card ending 0002 declined; MoMo ending 0000 not approved, 1111 insufficient balance; anything else succeeds.

## 2026-10-28 — WonaPremiere — routes `/premiere/…`
- Home: premiere rail above Because You Watched + "Wona Premiere" chip → `/premiere`.
- `/premiere` landing → `/premiere/list/showing|upcoming|past` → `/premiere/title/:id`.
- Upcoming titles open the countdown page; showing-now and past open the standard movie or series page (series has Episodes).
- Button states from the exports: "Reminder Set" (faded pink, navy text) and "✓ Added" (My Stuff). One tab label: "Trailer". Reminders and My Stuff are saved on the device until there is an API.

## 2026-10-28 — More tab — routes `/more`, `/my-stuff`, `/library`
- Bottom nav "More" → `/more`: profile, My Stuff and My Library tiles, Account list, Sign Out.
- `/my-stuff` on mobile uses the WONA design (desktop keeps the AfriPlay grid). `/library` shows rentals and purchases (sample only).
- Add `?empty` to `/my-stuff` or `/library` to see the empty-state designs.

## 2026-10-28 — Wiki tidy
- Removed answered questions and superseded log entries; rewrote open questions in plain words; added `pages/auth-flow.md`.
