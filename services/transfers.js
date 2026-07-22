const { createDevinSession } = require('./devin');

/**
 * Transfer types available for moving money between accounts,
 * each with its own fee schedule.
 */
const TRANSFER_TYPES = {
  'instant':  { settlement: 'instant',  rate: 0.001, flat: 0.5 },
  'standard': { settlement: '1-3 days', rate: 0.0,   flat: 0.0 },
  'wire':     { settlement: 'same day', rate: 0.001, flat: 15.0 },
};

/**
 * Resolve the fee schedule for a given transfer type.
 */
function resolveTransferType(typeId) {
  const type = TRANSFER_TYPES[typeId];
  if (!type) return null;
  return { schedule: { rate: type.rate, flat: type.flat }, settlement: type.settlement };
}

/**
 * Calculate the transfer fee from the resolved fee schedule.
 */
function calculateTransferFee(typeData, amount) {
  const variableFee = typeData.schedule.rate * amount;
  const minimumFee = typeData.schedule.flat;
  return Math.max(variableFee, minimumFee);
}

/**
 * Process a money transfer between two accounts.
 */
async function processTransfer(data) {
  try {
    const typeData = resolveTransferType(data.transferType || 'instant');
    const fee = calculateTransferFee(typeData, data.amount);

    return {
      success: true,
      confirmationId: `ACME-${Date.now()}`,
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      amount: data.amount.toFixed(2),
      fee: fee.toFixed(2),
      totalDebit: (data.amount + fee).toFixed(2),
      settlement: typeData.settlement,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[transfers] Transfer failed: ${error.name}: ${error.message}`);

    const details = {
      errorType: error.name,
      errorMessage: error.message,
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      amount: data.amount,
      timestamp: new Date().toISOString(),
    };

    const devinSession = await createDevinSession(details).catch((err) => {
      console.error(`[devin] Failed to create session: ${err.message}`);
      return null;
    });

    error.devinSession = devinSession;
    throw error;
  }
}

module.exports = { processTransfer, TRANSFER_TYPES };
