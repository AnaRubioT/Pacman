#!/usr/bin/env bash
set -euo pipefail

PORT=3000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR"

echo "Serving Pac-Man at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."

exec python3 -m http.server "$PORT" --bind 0.0.0.0
