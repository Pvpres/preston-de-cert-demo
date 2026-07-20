const express = require('express');
const { processTransfer } = require('../services/transfers');
const { ACCOUNTS, INVESTMENTS } = require('../services/accounts');

const router = express.Router();

router.get('/api/accounts', (_req, res) => {
  res.json({ accounts: ACCOUNTS, investments: INVESTMENTS });
});

router.post('/api/transfer', async (req, res) => {
  try {
    const result = await processTransfer({
      fromAccount: req.body.fromAccount || 'ACME-CHK-116129',
      toAccount: req.body.toAccount || 'ACME-SAV-6549743',
      amount: Number(req.body.amount) || 100,
      transferType: req.body.transferType || 'instant',
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
