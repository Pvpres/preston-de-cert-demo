/**
 * Careotter demo patient data (fictional, non-PHI).
 */
const PATIENTS = [
  { id: 'PT-100234', name: 'Margaret Chen', dob: '1958-03-14', mrn: 'MRN 100234', primaryProvider: 'Dr. Alvarez', lastVisit: '2026-06-02' },
  { id: 'PT-100871', name: 'James Whitfield', dob: '1979-11-02', mrn: 'MRN 100871', primaryProvider: 'Dr. Okafor', lastVisit: '2026-05-19' },
  { id: 'PT-101440', name: 'Sofia Ramirez', dob: '1991-07-27', mrn: 'MRN 101440', primaryProvider: 'Dr. Alvarez', lastVisit: '2026-07-01' },
  { id: 'PT-102055', name: 'Harold Nguyen', dob: '1946-01-09', mrn: 'MRN 102055', primaryProvider: 'Dr. Patel', lastVisit: '2026-06-24' },
];

const PROVIDERS = [
  { id: 'DR-01', name: 'Dr. Alvarez', specialty: 'Family Medicine' },
  { id: 'DR-02', name: 'Dr. Okafor', specialty: 'Internal Medicine' },
  { id: 'DR-03', name: 'Dr. Patel', specialty: 'Cardiology' },
];

const RECENT_ACTIVITY = [
  { id: 'ACT-001', date: '2026-07-01', description: 'Office visit — Sofia Ramirez (Dr. Alvarez)' },
  { id: 'ACT-002', date: '2026-06-24', description: 'Cardiology follow-up — Harold Nguyen (Dr. Patel)' },
  { id: 'ACT-003', date: '2026-06-02', description: 'Annual physical — Margaret Chen (Dr. Alvarez)' },
];

module.exports = { PATIENTS, PROVIDERS, RECENT_ACTIVITY };
