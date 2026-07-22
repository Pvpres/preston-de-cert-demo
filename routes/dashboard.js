const express = require('express');
const { listIncidents, getIncident } = require('../services/incidents');
const { createSession } = require('../services/devin');

const router = express.Router();

router.get('/api/incidents', (_req, res) => {
  res.json({ incidents: listIncidents() });
});

router.post('/api/incidents/:id/remediate', async (req, res) => {
  const incident = getIncident(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  if (!incident.remediable) {
    return res.status(400).json({ error: 'Incident is not auto-remediable' });
  }

  try {
    const session = await createSession({
      prompt: incident.prompt,
      title: incident.title_for_devin,
    });
    return res.json({
      incidentId: incident.id,
      dispatched: Boolean(session),
      devinSession: session,
    });
  } catch (error) {
    console.error(`[dashboard] Devin dispatch failed: ${error.message}`);
    return res.status(502).json({ error: 'Failed to dispatch Devin', detail: error.message });
  }
});

module.exports = router;
