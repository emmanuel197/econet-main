# Open questions

| # | Question | Blocks | Status |
|---|---|---|---|
| 1 | Figma access (figma-console token) | Design tokens, every screen | ✅ resolved 2026-10-26 |
| 2 | Test account (`ecozw` + 10-digit number) | Live verification of auth + content | deferred by user |
| 3 | Do the AfriPlay API hosts serve `econetzw`? CRM settings call failed to connect from the dev machine (for AfriPlay's uid too) | Homepage | ❓ open |
| 4 | Network check: Econet IP ranges; what wifi/broadband users see | Sign-in | ❓ open |
| 5 | Passwordless default-password model like AfriPlay? | Sign-in | ❓ open |
| 6 | Homepage rail order and channel-rail slots for WONA | Homepage | ❓ open |
| 7 | Username format: is the 10-digit number sent with the leading 0 (`ecozw0777123456`) as in the brief? | Sign-in | 🔶 brief example says yes |
| 8 | Where are the sign-in, details, watch, My Stuff, profile, subscriptions and notifications designs? Not on "All pages (developers)" | Those phases | ❓ open |
| 9 | Designer to confirm `4041:26313` (mislabelled?) and which desktop home frame is final | Home, EPG | ❓ open |
| 8 | Where are the sign-in, details, watch, My Stuff, profile, subscriptions and notifications designs? Not on "All pages (developers)" | Those phases | ❓ open |
| 9 | Designer to confirm `4041:26313` (mislabelled?) and which desktop home frame is final | Home, EPG | ❓ open |
| 10 | WONA CRM rail uids: the code looks up AfriPlay uids `afriplaytop10` and `onlyonafriplay` (`api/fetchMoviesApi.js`) | Home rails with real data | ❓ open |
| 11 | Subscription packages/plan ids in `src/data/subscriptionsData.js` are AfriPlay's; MTN-specific billing logic is now inert | Subscriptions | ❓ open |
| 12 | FAQ copy (`components/sections/landing/FaqSection.jsx`) is AfriPlay's text with the name swapped | Landing page | ❓ open |
| 13 | Phone input still allows any 10 digits; Zimbabwe numbers (07…) not validated | Sign-in | ❓ open |
| 14 | WonaPremiere, Trending Now, Wona Bundle and mobile Upcoming TV Shows have no known API/CRM source; they render from fixtures only (hidden in API mode except the bundle promo) | Mobile home with real data | ❓ open |
| 15 | Desktop comp has no WonaPremiere / Trending / Bundle rails — confirm they are mobile-only | Desktop home | ❓ open |
| 16 | Mobile search comps show a different bottom nav (Home, Movies, Live Tv, Search, avatar "More") from the mobile home comp (Home, Live Tv, Shorts, Search, More). Code keeps the home version everywhere — which is final? | Mobile nav | ❓ open |
| 17 | Mobile search has no app bar in the comps (so no bell/avatar there) — confirm that's intended | Mobile search | ❓ open |
| 18 | Featured live panel: viewer count, scoreboard (teams/score/minute) only exist in fixtures — is there an API/CRM source for them? | Live TV with real data | ❓ open |
| 19 | Shorts player: comp is 500×881 but code keeps 420 wide (fits 1080p laptop viewports). Confirm 420 is acceptable | Shorts player | ❓ open |
| 20 | Shorts spec frames say "gold" (likes, follow pill, share ring) — confirm WONA pink is intended | Shorts interactions | 🔶 assumed pink |
| 21 | Share links use `wona.com/r/<slug>` per the spec — confirm the real domain and that deep links resolve | Sharing | ❓ open |
