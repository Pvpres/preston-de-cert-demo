const axios = require('axios');

const DEVIN_API_BASE = process.env.DEVIN_API_BASE || 'https://api.devin.ai/v1';

/**
 * Build the investigation prompt sent to Devin when a transfer fails.
 */
function buildPrompt(details) {
  return [
    `Production alert: **${details.errorType}: ${details.errorMessage}**`,
    '',
    `- Service: careotter-scheduling`,
    `- Repo: ${process.env.TARGET_REPO || 'Pvpres/preston-de-cert-demo'}`,
    `- Endpoint: POST /api/appointments`,
    `- Patient: ${details.patientId}`,
    `- Provider: ${details.providerId}`,
    `- Visit type: ${details.visitType}`,
    `- Timestamp: ${details.timestamp}`,
    '',
    'A front-desk user clicked "Schedule Appointment" in the Careotter patient records portal and scheduling failed with the error above.',
    '',
    'Investigate the root cause in the repo, implement a minimal fix, and open a pull request. The bug is in the copay calculation path (`services/appointments.js`). Verify the fix by scheduling an appointment locally before opening the PR.',
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
      title: `Careotter: ${details.errorType} in appointment scheduling`,
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

/**
 * Create a Devin session from an explicit prompt/title. Used by the
 * error-monitoring dashboard to dispatch Devin at a specific incident.
 * Returns { sessionId, url } on success, or null if no API key is set.
 */
async function createSession({ prompt, title }) {
  const apiKey = process.env.DEVIN_API_KEY;
  if (!apiKey) {
    console.warn('[devin] DEVIN_API_KEY not set — skipping session creation');
    return null;
  }

  const response = await axios.post(
    `${DEVIN_API_BASE}/sessions`,
    { prompt, title },
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

module.exports = { createDevinSession, createSession, buildPrompt };
