#!/bin/bash
set -e

cd "$(dirname "$0")/frontend"

echo "==> Frontend Build Started"
echo "==> Current directory: $(pwd)"
echo "==> Node/Bun versions:"
bun --version
node --version || true

echo "==> Installing dependencies..."
bun install

echo "==> Verifying next installation..."
if [ -f "node_modules/.bin/next" ]; then
  echo "✓ next binary found in node_modules/.bin/"
else
  echo "✗ next binary NOT found, attempting reinstall..."
  bun install --no-frozen-lockfile
fi

echo "==> Building application..."
bun run build

echo "==> Build completed successfully ✓"
