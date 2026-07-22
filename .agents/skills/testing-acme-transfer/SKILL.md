---
name: testing-acme-transfer
description: Run and test the Acme Bank transfer demo end-to-end, including the Devin session trigger. Use when verifying the transfer error flow or demoing event-driven Devin.
---

# Testing the Acme Bank Transfer Demo

## Run locally
```bash
npm install
DEVIN_API_KEY=... node server.js   # or put the key in .env
# open http://localhost:3000
```

## Golden path test
1. Load http://localhost:3000 — expect the green TD-style Acme Bank page with accounts and a "Transfer Money" card.
2. Click **Transfer Money** (defaults are fine). Expect a red banner:
   `TypeError: Cannot read properties of undefined (reading 'rate')`
   - With `DEVIN_API_KEY` set: banner includes a "View session" link to app.devin.ai.
   - Without the key: banner says an investigation "has been requested" and the server logs a graceful skip.
3. Server log lines to verify: `[transfers] Transfer failed: TypeError ...` and `[devin] Session created: devin-... — https://app.devin.ai/sessions/...`.

## Gotchas
- The intentional bug is in `services/transfers.js` (`calculateTransferFee` reads `typeData.schedule.rate`; `resolveTransferType` returns `{ params, settlement }`). The triggered Devin session may open a PR that fixes it — close/revert that PR between demos or the demo stops erroring.
- Every Transfer click creates a new Devin session — avoid spamming clicks.
- The "View session" link shows a login wall if the testing browser isn't authenticated to app.devin.ai; verify session existence via the Devin MCP/API instead.

## Devin Secrets Needed
- `DEVIN_API_KEY`: Devin API key used by the app to create investigation sessions.
