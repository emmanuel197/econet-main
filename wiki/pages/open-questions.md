# Open questions

Only unanswered items. Answered ones were removed on 2026-10-28; the decisions are in `log.md`.
Each row says what is unknown, what it holds up, and who can answer.

## For the PM — data, accounts, servers
| # | What we don't know | What it holds up |
|---|---|---|
| 1 | A test WONA account (`ecozw` + 10-digit number) | Trying the real sign-in and real content |
| 2 | Do the AfriPlay servers serve WONA (`econetzw`)? The settings call failed from our machine | Every page with real data |
| 3 | Home rail order, and the WONA ids for the Top 10 / Only on Wona rails (code still uses AfriPlay's `afriplaytop10`, `onlyonafriplay`) | Home rails with real data |
| 4 | Subscription packages are AfriPlay's, priced in GHS (`src/data/subscriptionsData.js`) | Subscriptions page |
| 5 | Landing-page FAQ text is AfriPlay's with the name changed | Landing page |
| 6 | WONA support contacts (phone, WhatsApp, email, socials) — "To be confirmed" for now | Profile → Support |
| 7 | Real share-link domain (code uses `wona.com/r/…` from the spec) | Shorts sharing |
| 8 | Where the data comes from for: WonaPremiere schedule and reminders, Trending Now, Wona Bundle, Upcoming TV Shows, live scores / viewer counts, My Library (rentals, purchases) — sample data only today | Those sections with real data |
| 9 | TVOD and payment APIs (catalogue, card and Mobile Money charges, receipts) | Rent or buy with real money |
| 10 | TVOD screens use Ghana values from the designs (GH₵, MTN/Vodafone/AirtelTigo, +233). WONA is Zimbabwe — EcoCash? USD/ZiG? | TVOD checkout |

## For the designer
| # | What we don't know | What it holds up |
|---|---|---|
| 11 | Which desktop home frame is final, and is `4041:26313` mislabelled? | Desktop home, TV guide |
| 12 | WonaPremiere, Trending and Wona Bundle only appear in the mobile designs — mobile-only on purpose? Desktop has no way into WonaPremiere | Desktop home |
| 13 | Shorts player is 420px wide in code (design 500) so it fits laptop screens — OK? | Shorts player |
| 14 | More → Downloads and Settings have no screens (they show a "preview" message) | More tab |
| 15 | The "Wona Pro · Active" label on the More page needs the user's real plan — confirm what it shows for no plan / expired | More tab |
