const axios = require('axios');

const DEVIN_API_BASE = process.env.DEVIN_API_BASE || 'https://api.devin.ai/v1';

/**
 * Build the investigation prompt sent to Devin when a transfer fails.
 */
function buildPrompt(details) {
  return [
    `Production alert: **${details.errorType}: ${details.errorMessage}**`,
    '',
    `- Service: acme-bank-transfers`,
    `- Repo: ${process.env.TARGET_REPO || 'Pvpres/preston-de-cert-demo'}`,
    `- Endpoint: POST /api/transfer`,
    `- From account: ${details.fromAccount}`,
    `- To account: ${details.toAccount}`,
    `- Amount: $${details.amount}`,
    `- Timestamp: ${details.timestamp}`,
    '',
    'A customer clicked "Transfer Money" on the Acme Bank online banking page and the transfer failed with the error above.',
    '',
    'Investigate the root cause in the repo, implement a minimal fix, and open a pull request. The bug is in the transfer fee calculation path (`services/transfers.js`). Verify the fix by running the transfer locally before opening the PR.',
  ].join('\n');
}

/**
 * Create a Devin session via the Devin API. Fire-and-forget from the
 * caller's perspective; returns { sessionId, url } on success.
 */
async function createDevinSession(details) {
  const apiKey = process.env.DEVIN_API_KEY;
  if (!apiKey) {
    console.warn('[devin] DEVIN_API_KEY not set — skipping session creation');
    return null;
  }

  const response = await axios.post(
    `${DEVIN_API_BASE}/sessions`,
    {
      prompt: buildPrompt(details),
      title: `Acme Bank: ${details.errorType} in transfer flow`,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  const { session_id: sessionId, url } = response.data;
  console.log(`[devin] Session created: ${sessionId} — ${url}`);
  return { sessionId, url };
}

module.exports = { createDevinSession, buildPrompt };
