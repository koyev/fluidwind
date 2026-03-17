#!/usr/bin/env bash
# Run the sandbox locally against the current (unpublished) fluidwind source.
# Usage: pnpm sandbox
#
# What it does:
#   1. Builds fluidwind (dist/)
#   2. Installs the local build into sandbox/ via pnpm pack
#   3. Starts the sandbox dev server
#   4. On exit (Ctrl-C), restores sandbox/ to the published npm version

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SANDBOX="$ROOT/sandbox"

restore() {
  echo ""
  echo "Restoring sandbox to published fluidwind..."
  cd "$SANDBOX"
  pnpm install --silent fluidwind@^1.1.0
  echo "Done."
}
trap restore EXIT

echo "▶ Building fluidwind..."
cd "$ROOT"
pnpm run build --silent

echo "▶ Packing fluidwind..."
PACK_FILE=$(pnpm pack --silent)

echo "▶ Installing local build into sandbox..."
cd "$SANDBOX"
pnpm install --silent "$ROOT/$PACK_FILE"
rm -f "$ROOT/$PACK_FILE"

echo "▶ Starting sandbox dev server (Ctrl-C to stop and restore)"
echo ""
pnpm run dev
