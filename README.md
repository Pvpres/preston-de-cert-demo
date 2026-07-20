# preston-de-cert-demo — Acme Bank Event-Driven Devin Demo

A demo online-banking transfer page for **Acme Bank**. Clicking **Transfer Money** hits a production bug (`TypeError`), the page shows the error, and the server automatically creates a **Devin session** via the Devin API to investigate and fix it.

## How it works

```
Transfer Money click → POST /api/transfer → TypeError in fee calculation
    → error returned to the page (red banner)
    → POST https://api.devin.ai/v1/sessions (DEVIN_API_KEY)
    → "View session" link shown on the page
```

The intentional bug: `resolveTransferType()` returns `{ params, settlement }`, but `calculateTransferFee()` reads `typeData.schedule.rate` → `TypeError: Cannot read properties of undefined (reading 'rate')`.

## Setup

```bash
npm install
cp .env.example .env   # set DEVIN_API_KEY
npm start              # http://localhost:3000
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `DEVIN_API_KEY` | Devin API key used to create investigation sessions |
| `DEVIN_API_BASE` | Devin API base URL (default `https://api.devin.ai/v1`) |
| `TARGET_REPO` | Repo referenced in the Devin prompt (default `Pvpres/preston-de-cert-demo`) |
| `PORT` | Server port (default `3000`) |
