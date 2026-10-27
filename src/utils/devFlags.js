// Dev-only toggles, set in .env.local (gitignored, build-time — restart dev server
// after changing). See .env.example.

// Treat the session as authenticated without logging in (see authConstants.js).
// (Defined there to avoid a circular import; re-exported here for discoverability.)
export { AUTH_BYPASS } from "./authConstants";

// Force pages to render their local fixture data (the as-designed dummy assets)
// instead of live API content. Content thunks no-op while this is on, so every
// rail/grid falls back to src/data/*Fixtures.js — flip on to review designs
// exactly as they were built, off to see real integration data.
export const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === "true";

// CRM purchase `bill` parameter (legacy hardcoded bill: true). Set
// VITE_BILLING=false locally to place test orders WITHOUT charging the
// subscriber's airtime/bundle; anything else (including unset) bills normally.
export const BILLING_ENABLED = import.meta.env.VITE_BILLING !== "false";
if (!BILLING_ENABLED) {
  console.warn("[dev] VITE_BILLING is OFF — purchases send bill:false (no real charge)");
}
if (USE_FIXTURES) {
  console.warn("[dev] VITE_USE_FIXTURES is ON — pages render fixture/dummy content, API thunks disabled");
}
