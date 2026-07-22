const { createDevinSession } = require('./devin');

/**
 * Visit types available for scheduling, each with its own
 * insurance coverage schedule.
 */
const VISIT_TYPES = {
  'office-visit': { duration: 30, rate: 0.2, copay: 25.0 },
  'annual-physical': { duration: 60, rate: 0.0, copay: 0.0 },
  'specialist': { duration: 45, rate: 0.3, copay: 50.0 },
};

/**
 * Resolve the coverage schedule for a given visit type.
 */
function resolveVisitType(typeId) {
  const type = VISIT_TYPES[typeId];
  if (!type) return null;
  return { schedule: { rate: type.rate, copay: type.copay }, duration: type.duration };
}

/**
 * Calculate the patient's expected copay from the resolved coverage data.
 */
function calculateCopay(coverageData, visitCost) {
  const coinsurance = coverageData.schedule.rate * visitCost;
  const baseCopay = coverageData.schedule.copay;
  return Math.max(coinsurance, baseCopay);
}

/**
 * Schedule an appointment for a patient.
 */
async function scheduleAppointment(data) {
  try {
    const coverageData = resolveVisitType(data.visitType || 'office-visit');
    const copay = calculateCopay(coverageData, data.visitCost || 150);

    return {
      success: true,
      confirmationId: `CO-${Date.now()}`,
      patientId: data.patientId,
      providerId: data.providerId,
      date: data.date,
      visitType: data.visitType,
      durationMinutes: coverageData.duration,
      expectedCopay: copay.toFixed(2),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[appointments] Scheduling failed: ${error.name}: ${error.message}`);

    const details = {
      errorType: error.name,
      errorMessage: error.message,
      patientId: data.patientId,
      providerId: data.providerId,
      visitType: data.visitType,
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

module.exports = { scheduleAppointment, VISIT_TYPES };
