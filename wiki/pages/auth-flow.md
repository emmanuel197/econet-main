# Auth flow (sign-up / sign-in)

✅ VERIFIED in code 2026-10-28 (`src/api/auth.js`, `src/pages/auth/*`). Not yet tried live — no test account (open question 1).

Web and mobile use the same pages and code (responsive `AuthShell`); there is no separate mobile flow.
Passwordless: the user only types their phone number and a 6-digit code. The backend still needs a password, so every account uses one shared default (`DEFAULT_PASSWORD` in `api/auth.js`).

## Steps
| Step | Sign-up (`/signup`) | Sign-in (`/signin`) |
|---|---|---|
| 1. Page opens | Region check `GET {CM}/api/auth/` — not allowed → `/out-of-region` | same |
| 2. User types number | 10 digits, e.g. `0771234567`; username becomes `ecozw0771234567` | same |
| 3. Network check | `GET {CM}/api/auth/?operator_uid=econetzw&usr=<username>` → `valid:false` = "your number is not on this network" (CRM checks the caller's IP is on Econet) | same |
| 4. Send code | `POST {CM}/api/otp/?mode=generate` → `/otp-verification` | same |
| 5. Check code | `POST {CM}/api/otp/?mode=validate` | same |
| 6. Account | `POST {CM}/api/subscriber/` creates the subscriber; "subscriber already exist" → treated as sign-in | — |
| 7. Log in | Reset CRM password to the default, then `POST {CLIENT}/api/client/v2/global/login` (v1 if v2 is down) with `ecozw…@econetzw` | same |
| 8. Done | Login response saved in the `user_info` cookie → back to the page the user wanted, or home | same |

- Signed-in check: `ProtectedRoute` looks for the `user_info` cookie; without it → `/signup`.
- Tokens renew automatically on a 401 (`api/refreshToken.js`). Sign out: `logout()` in `api/account.js`.
- Dev only: `VITE_BYPASS_AUTH=true` in `.env.local` skips all of this.
- `{CM}` = `https://tvanywhereonline.com/cm`, `{CLIENT}` = `https://ott.tvanywhereafrica.com:28182`.
