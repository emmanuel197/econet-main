# Debugging & Verification Workflow

> Adapted from MangoTV's `wiki/debugging-workflow.md` + `PROMPT_PLAYBOOK.md` (2026-07-28).
> Playwright here is NOT a test suite — it is Claude driving a real browser through the
> Playwright MCP server (`playwright`, registered in the project's `claude mcp` config)
> to verify each change against observable behavior. Tags: see [[CLAUDE]].

## Console logging convention `✅ VERIFIED` (existing practice)

New code ships with step logs so the browser console is an inspectable record:

```js
console.log("[ComponentName] step description:", relevantData);
// established prefixes: [api] (fetch modules), [HomePage], [details], [watch], [dev]
```

Rules (Mango's, already largely followed here):
1. Async operations: log before the call, the response SHAPE (not full payload), and errors
   with context (`e.response?.status`, `e.response?.data || e.message`).
2. Conditional branches that pick a data source: log which branch and why
   (e.g. "clientContext not ready — fixtures render").
3. Style-affecting calculations: log computed values.
4. Logs are dev-gated where noisy (`import.meta.env.DEV`) and STAY until sign-off;
   a pre-deploy cleanup pass strips them (already on the deploy checklist).

## Playwright verification loop (run after each change)

1. `npm run dev` (vite, port 5173; restart after `.env.local` changes).
2. Navigate to the affected route with the Playwright MCP browser tools.
3. Read the console: expected logs in expected ORDER with expected values —
   this validates data flow, not just "no crash". Zero unexpected errors.
4. Screenshot for visual verification; compare against the Figma comp /
   reference screenshots.
5. Viewport matrix for responsive work: **390×844** (mobile comp, --mvw),
   768 (md boundary), 1440 and 1920×966 (wide-but-short, --vwh poster scale).
6. Log the concrete observation in [[log]] ("verified: X visible at Y", not "verified").

Auth-gated flows: dev bypass flags live in `.env.local` (`VITE_BYPASS_AUTH`,
`VITE_USE_FIXTURES`, `VITE_BILLING`) — see `utils/devFlags.js`. Real API content
requires a signed-in session (operator + user_info cookie) and, for network-gated
auth, MTN data (see [[api-contract]]).

## Baseline & audit sweeps (Mango pattern)

- **Baseline** before a work block: screenshot + console-check every top-level route,
  so later regressions are attributable.
- **Audit**: page-by-page Playwright screenshots vs Figma, desktop + 390px.
- **Network validation**: assert real request outcomes from the console/network log
  (e.g. CRM log POSTs returning 200), not from code reading alone.

Backlinks: [[index]] · [[conventions]] · [[log]]
