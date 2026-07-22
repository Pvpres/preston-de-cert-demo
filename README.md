# preston-de-cert-demo — Careotter Demo

Demo assets for **Careotter**, a fictional 20-year-old healthcare software company that helps doctor offices manage patient records. Two demos live here:

1. **Event-driven Devin** (`/` — Node/Express): a front-desk patient portal where clicking **Schedule Appointment** hits a production bug (`TypeError`), shows the error, and auto-creates a Devin investigation session via the Devin API.
2. **Java migration** (`careotter-records/`): a deliberately outdated Java 8 / Spring Boot 1.5 patient-records service used as the target for a live "Devin migrates legacy Java" demo.

## 1. Event-driven demo (portal)

```
Schedule Appointment click → POST /api/appointments → TypeError in copay calculation
    → error banner shown on the page
    → POST https://api.devin.ai/v1/sessions (DEVIN_API_KEY) → Devin investigates & opens a PR
```

The intentional bug: `resolveVisitType()` returns `{ params, duration }`, but `calculateCopay()` reads `coverageData.schedule.rate` → `TypeError: Cannot read properties of undefined (reading 'rate')`.

### Run

```bash
npm install
cp .env.example .env   # set DEVIN_API_KEY
npm start              # http://localhost:3000
```

| Variable | Description |
|----------|-------------|
| `DEVIN_API_KEY` | Devin API key used to create investigation sessions |
| `DEVIN_API_BASE` | Devin API base URL (default `https://api.devin.ai/v1`) |
| `TARGET_REPO` | Repo referenced in the Devin prompt (default `Pvpres/preston-de-cert-demo`) |
| `PORT` | Server port (default `3000`) |

Demo tips: each click creates a new Devin session; the triggered session opens a PR fixing the bug — close/revert it between runs to keep the demo bug in place.

## 2. Java migration demo (`careotter-records/`)

A small patient-records REST service that is **intentionally outdated**:

- Java 8, Spring Boot **1.5.22**, `javax.*` namespace
- **log4j 1.2.17** (EOL, CVE-2019-17571) — compliance talking point
- Shared static `SimpleDateFormat` (thread-unsafe under load)
- `javax.xml.bind.DatatypeConverter` (removed from the JDK in Java 11)
- `Hashtable`/`Vector`, raw types, anonymous inner-class comparators
- JUnit 4, deprecated Apache HttpClient 4.3

### The visible error (the demo hook)

The Azure migration requires this service to build on **Java 17**. It doesn't —
the outdated code fails to compile. Reproduce it with one command:

```bash
cd careotter-records
./reproduce-error.sh          # builds on JDK 17, prints the failure
```

You'll see:

```
[ERROR] .../util/DateUtil.java:[7,22] package javax.xml.bind does not exist
[ERROR] .../util/DateUtil.java:[39,16] cannot find symbol: variable DatatypeConverter
[ERROR] BUILD FAILURE
```

`javax.xml.bind` (JAXB) was removed from the JDK in Java 11, so the Java 8 code
won't compile on 17. The full captured output is in
[`careotter-records/EXPECTED-ERROR.txt`](careotter-records/EXPECTED-ERROR.txt) —
copy it straight into a Devin session to kick off the migration.

### Build & run on the legacy JDK 8 (still works — that's the point)

```bash
cd careotter-records
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 mvn test          # 4 tests pass
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 mvn spring-boot:run  # http://localhost:8081/api/patients
```

### Demo prompt for Devin

> Migrate `careotter-records/` from Java 8 / Spring Boot 1.5 to Java 17 / Spring Boot 3:
> jakarta.* namespace, JUnit 5, replace log4j 1.x with SLF4J/Logback, replace the
> thread-unsafe static SimpleDateFormat with java.time, remove javax.xml.bind usage,
> use generics instead of raw Hashtable/Vector. All tests must pass on Java 17.
