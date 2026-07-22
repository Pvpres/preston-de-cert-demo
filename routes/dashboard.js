const express = require('express');
const { listIncidents, getIncident, getAssignment, setAssignment } = require('../services/incidents');
const { createSession } = require('../services/devin');

const router = express.Router();

router.get('/api/incidents', (_req, res) => {
  res.json({ incidents: listIncidents() });
});

/**
 * Auto-remediation: assign an incident to Devin. Idempotent — if the incident
 * has already been assigned, the existing session is returned instead of
 * dispatching a new one. The dashboard calls this automatically for every
 * unresolved, remediable incident (no manual trigger).
 */
router.post('/api/incidents/:id/assign', async (req, res) => {
  const incident = getIncident(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  if (!incident.remediable) {
    return res.status(400).json({ error: 'Incident is not auto-remediable' });
  }

  const existing = getAssignment(incident.id);
  if (existing) {
    return res.json({
      incidentId: incident.id,
      dispatched: true,
      alreadyAssigned: true,
      devinSession: { sessionId: existing.sessionId, url: existing.url },
    });
  }

  try {
    const session = await createSession({
      prompt: incident.prompt,
      title: incident.title_for_devin,
    });
    if (session) {
      setAssignment(incident.id, session);
    }
    return res.json({
      incidentId: incident.id,
      dispatched: Boolean(session),
      alreadyAssigned: false,
      devinSession: session,
    });
  } catch (error) {
    console.error(`[dashboard] Devin dispatch failed: ${error.message}`);
    return res.status(502).json({ error: 'Failed to dispatch Devin', detail: error.message });
  }
});

module.exports = router;
