#!/usr/bin/env bash
# Run the sandbox locally against the current (unpublished) fluidwind source.
# Usage: npm run sandbox
#
# What it does:
#   1. Builds fluidwind (dist/)
#   2. Installs the local build into sandbox/ via npm pack
#   3. Starts the sandbox dev server
#   4. On exit (Ctrl-C), restores sandbox/ to the published npm version

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SANDBOX="$ROOT/sandbox"

restore() {
  echo ""
  echo "Restoring sandbox to published fluidwind..."
  cd "$SANDBOX"
  npm install --silent fluidwind@^1.1.0
  echo "Done."
}
trap restore EXIT

echo "▶ Building fluidwind..."
cd "$ROOT"
npm run build --silent

echo "▶ Packing fluidwind..."
PACK_FILE=$(npm pack --quiet)

echo "▶ Installing local build into sandbox..."
cd "$SANDBOX"
npm install --silent "$ROOT/$PACK_FILE"
rm -f "$ROOT/$PACK_FILE"

echo "▶ Starting sandbox dev server (Ctrl-C to stop and restore)"
echo ""
npm run dev
