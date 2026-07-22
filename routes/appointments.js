const express = require('express');
const { scheduleAppointment } = require('../services/appointments');
const { PATIENTS, PROVIDERS, RECENT_ACTIVITY } = require('../services/patients');

const router = express.Router();

router.get('/api/patients', (_req, res) => {
  res.json({ patients: PATIENTS, providers: PROVIDERS, recentActivity: RECENT_ACTIVITY });
});

router.post('/api/appointments', async (req, res) => {
  try {
    const result = await scheduleAppointment({
      patientId: req.body.patientId || 'PT-100234',
      providerId: req.body.providerId || 'DR-01',
      date: req.body.date || '2026-08-01',
      visitType: req.body.visitType || 'office-visit',
      visitCost: Number(req.body.visitCost) || 150,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      errorClass: error.name,
      devinSession: error.devinSession || null,
    });
  }
});

module.exports = router;
