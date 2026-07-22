---
name: testing-careotter
description: Run and test the Careotter demos end-to-end — the appointment-error Devin trigger and the legacy Java migration service. Use when verifying the error flow, demoing event-driven Devin, or working on the Java migration demo.
---

# Testing the Careotter Demos

## 1. Event-driven portal (Node/Express)

```bash
npm install
DEVIN_API_KEY=... node server.js   # or put the key in .env
# open http://localhost:3000
```

### Golden path test
1. Load http://localhost:3000 — expect the teal Careotter patient portal with today's patients and a "Schedule Appointment" card.
2. Click **Schedule Appointment** (defaults are fine). Expect a red banner:
   `TypeError: Cannot read properties of undefined (reading 'rate')`
3. Server log lines to verify: `[appointments] Scheduling failed: TypeError ...` and, with the key set, `[devin] Session created: devin-... — https://app.devin.ai/sessions/...`. Without the key the server logs a graceful skip.

### Gotchas
- The intentional bug is in `services/appointments.js` (`calculateCopay` reads `coverageData.schedule.rate`; `resolveVisitType` returns `{ params, duration }`). Triggered Devin sessions may open a PR fixing it — close/revert between demos.
- Every click creates a new Devin session — avoid spamming clicks.
- The banner intentionally does NOT link to the Devin session; verify session creation via server logs or the Devin MCP/API.

## 2. Legacy Java service (`careotter-records/`)

Intentionally outdated (Java 8, Spring Boot 1.5.22, javax.*, log4j 1.2, static SimpleDateFormat, javax.xml.bind, JUnit 4) — the target of the migration demo. Do NOT "fix" its outdatedness outside a migration demo session.

```bash
sudo apt-get install -y openjdk-8-jdk maven   # if not present
cd careotter-records
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 mvn test            # 4 tests pass on JDK 8
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 mvn spring-boot:run # http://localhost:8081/api/patients
```

### The visible error (demo hook)
`./reproduce-error.sh` builds on JDK 17 and fails deterministically:
`package javax.xml.bind does not exist` → `BUILD FAILURE`. Captured output is in
`careotter-records/EXPECTED-ERROR.txt` for pasting into a Devin session.

- It will NOT build on Java 11+ (javax.xml.bind removed) — that is by design.
- Migration demo prompt lives in the README under "Demo prompt for Devin".

## Devin Secrets Needed
- `DEVIN_API_KEY`: Devin API key used by the portal to create investigation sessions.
