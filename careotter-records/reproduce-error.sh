#!/usr/bin/env bash
#
# Careotter migration demo — reproduce the build failure.
#
# Careotter's records service was written for Java 8. The Microsoft/Azure
# migration requires it to build on a modern JDK (17). This script builds
# it on Java 17 to surface the failure you can hand to Devin.
#
# Usage:  ./reproduce-error.sh
#
set -uo pipefail
cd "$(dirname "$0")"

JDK17="${JAVA17_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"

echo "=============================================================="
echo " Building careotter-records on $( "$JDK17/bin/java" -version 2>&1 | head -1 )"
echo "=============================================================="
echo

JAVA_HOME="$JDK17" mvn -B -q clean package
status=$?

echo
if [ $status -ne 0 ]; then
  echo "=============================================================="
  echo " BUILD FAILED (exit $status) — outdated code is not JDK-17 compatible."
  echo " Copy the [ERROR] lines above and send them to Devin to migrate."
  echo "=============================================================="
fi
exit $status
