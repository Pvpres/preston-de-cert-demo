/**
 * Mock ("mkco") incident data for the Careotter error-monitoring dashboard.
 * Modeled on Sentry/Snyk issue streams. The first incident is the live one
 * that dispatches a real Devin session; the rest are static history.
 */
const INCIDENTS = [
  {
    id: 'CO-4821',
    status: 'unresolved',
    level: 'error',
    title: "TypeError: Cannot read properties of undefined (reading 'rate')",
    culprit: 'services/appointments.js in calculateCopay',
    service: 'careotter-scheduling',
    environment: 'production',
    events24h: 1284,
    users: 37,
    firstSeen: '2026-07-20T18:02:11Z',
    lastSeen: '2026-07-20T20:24:53Z',
    release: 'careotter-web@4.7.2',
    endpoint: 'POST /api/appointments',
    stacktrace: [
      "TypeError: Cannot read properties of undefined (reading 'rate')",
      '    at calculateCopay (services/appointments.js:34:41)',
      '    at scheduleAppointment (services/appointments.js:43:19)',
      '    at POST /api/appointments (routes/appointments.js:14:28)',
      '    at Layer.handle [as handle_request] (express/lib/router/layer.js:95:5)',
    ].join('\n'),
    breadcrumbs: [
      { time: '20:24:51', category: 'ui.click', message: 'Front desk clicked "Schedule Appointment"' },
      { time: '20:24:52', category: 'http', message: 'POST /api/appointments 500' },
      { time: '20:24:53', category: 'exception', message: 'Unhandled TypeError in calculateCopay' },
    ],
    remediable: true,
    prompt: [
      'Production incident from Careotter error monitoring:',
      "**TypeError: Cannot read properties of undefined (reading 'rate')**",
      '',
      '- Service: careotter-scheduling',
      '- Endpoint: POST /api/appointments',
      '- Culprit: services/appointments.js in calculateCopay',
      '- Events (24h): 1284 across 37 users',
      '',
      'The copay calculation crashes: resolveVisitType() returns { params, duration } but',
      'calculateCopay() reads coverageData.schedule.rate. Investigate the root cause,',
      'implement a minimal fix, verify by scheduling an appointment locally, and open a PR.',
    ].join('\n'),
    title_for_devin: "Careotter: TypeError in appointment scheduling copay calc",
  },
  {
    id: 'CO-4795',
    status: 'unresolved',
    level: 'error',
    title: 'BUILD FAILURE: package javax.xml.bind does not exist',
    culprit: 'careotter-records/util/DateUtil.java',
    service: 'careotter-records',
    environment: 'ci',
    events24h: 6,
    users: 3,
    firstSeen: '2026-07-19T09:11:00Z',
    lastSeen: '2026-07-20T14:40:02Z',
    release: 'careotter-records@2.14.7',
    endpoint: 'CI: mvn clean package (JDK 17)',
    stacktrace: [
      '[ERROR] COMPILATION ERROR :',
      '[ERROR] DateUtil.java:[7,22] package javax.xml.bind does not exist',
      '[ERROR] DateUtil.java:[39,16] cannot find symbol: variable DatatypeConverter',
      '[ERROR] BUILD FAILURE',
    ].join('\n'),
    breadcrumbs: [
      { time: '14:39:58', category: 'ci', message: 'Azure Pipelines: build careotter-records on JDK 17' },
      { time: '14:40:01', category: 'compile', message: 'maven-compiler-plugin failed' },
      { time: '14:40:02', category: 'exception', message: 'javax.xml.bind removed in Java 11' },
    ],
    remediable: true,
    prompt: [
      'CI build failure from Careotter error monitoring:',
      '**BUILD FAILURE: package javax.xml.bind does not exist**',
      '',
      '- Service: careotter-records (Java 8 / Spring Boot 1.5.22)',
      '- Build: mvn clean package on JDK 17 (Azure migration target)',
      '- Culprit: careotter-records/src/main/java/com/careotter/records/util/DateUtil.java',
      '',
      'The service does not compile on Java 17. Migrate careotter-records/ from Java 8 / Spring',
      'Boot 1.5 to Java 17 / Spring Boot 3: jakarta.* namespace, JUnit 5, replace log4j 1.x with',
      'SLF4J/Logback, replace the thread-unsafe static SimpleDateFormat with java.time, remove',
      'javax.xml.bind usage, use generics instead of raw Hashtable/Vector. All tests must pass on Java 17.',
    ].join('\n'),
    title_for_devin: 'Careotter: migrate careotter-records to Java 17 / Spring Boot 3',
  },
  {
    id: 'CO-4610',
    status: 'resolved',
    level: 'warning',
    title: 'Slow query: patient_records full table scan (>1.2s)',
    culprit: 'PatientStore.findRecordsForPatient',
    service: 'careotter-records',
    environment: 'production',
    events24h: 0,
    users: 0,
    firstSeen: '2026-07-12T11:20:00Z',
    lastSeen: '2026-07-18T08:03:00Z',
    release: 'careotter-records@2.14.6',
    endpoint: 'GET /api/patients/{id}/records',
    stacktrace: 'PerformanceWarning: query exceeded 1000ms threshold (1243ms)',
    breadcrumbs: [],
    remediable: false,
    prompt: '',
    title_for_devin: '',
  },
];

/**
 * In-memory assignment store: incidentId -> { sessionId, url, assignedAt }.
 * Keeps auto-remediation idempotent so refreshing the dashboard reuses the
 * Devin session already dispatched for an incident instead of creating a new
 * one. Resets when the server restarts.
 */
const assignments = {};

function getAssignment(id) {
  return assignments[id] || null;
}

function setAssignment(id, session) {
  assignments[id] = { ...session, assignedAt: new Date().toISOString() };
  return assignments[id];
}

function toClient(i) {
  const a = getAssignment(i.id);
  return {
    id: i.id,
    status: i.status,
    level: i.level,
    title: i.title,
    culprit: i.culprit,
    service: i.service,
    environment: i.environment,
    events24h: i.events24h,
    users: i.users,
    firstSeen: i.firstSeen,
    lastSeen: i.lastSeen,
    release: i.release,
    endpoint: i.endpoint,
    stacktrace: i.stacktrace,
    breadcrumbs: i.breadcrumbs,
    remediable: i.remediable,
    assignee: a ? { type: 'devin', url: a.url, sessionId: a.sessionId, assignedAt: a.assignedAt } : null,
  };
}

function listIncidents() {
  return INCIDENTS.map(toClient);
}

function getIncident(id) {
  return INCIDENTS.find((i) => i.id === id) || null;
}

module.exports = { INCIDENTS, listIncidents, getIncident, getAssignment, setAssignment };
