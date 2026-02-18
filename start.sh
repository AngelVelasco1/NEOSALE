#!/bin/bash
set -e

echo "==> Starting NEOSALE Frontend"
cd frontend

# Always ensure dependencies are installed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "Installing dependencies..."
  bun install
fi

# Always ensure app is built
if [ ! -d ".next" ]; then
  echo "Building application..."
  bun run build
fi

echo "==> Starting on port ${PORT:-3000}..."
exec bun run start

