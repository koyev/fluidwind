#!/usr/bin/env bash
# Run the sandbox locally against the current (unpublished) fluidwind source.
# Usage: pnpm sandbox
#
# What it does:
#   1. Builds fluidwind (dist/)
#   2. Packs it and installs the tarball into sandbox/
#   3. Starts the sandbox dev server
#   4. On exit (Ctrl-C), restores sandbox/ to the published npm version

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SANDBOX="$ROOT/sandbox"

restore() {
  echo ""
  echo "Restoring sandbox to published fluidwind..."
  cd "$SANDBOX"
  pnpm add fluidwind@^1.1.0 --silent
  echo "Done."
}
trap restore EXIT

echo "▶ Building fluidwind..."
cd "$ROOT"
pnpm run build

echo "▶ Packing fluidwind..."
PACK_FILE=$(pnpm pack 2>/dev/null | tail -1)

echo "▶ Installing local build into sandbox..."
cd "$SANDBOX"
pnpm add "$ROOT/$PACK_FILE" --silent
rm -f "$ROOT/$PACK_FILE"

echo "▶ Starting sandbox dev server (Ctrl-C to stop and restore)"
echo ""
pnpm run dev
