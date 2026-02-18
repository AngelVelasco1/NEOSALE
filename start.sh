#!/bin/bash
set -e

echo "==> Checking and installing dependencies if needed..."
cd frontend

# Always ensure dependencies are installed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "Installing frontend dependencies..."
  bun install --frozen-lockfile
fi

# Always ensure app is built
if [ ! -d ".next" ]; then
  echo "Building Next.js application..."
  bun run build
fi

echo "==> Starting Next.js server on port ${PORT:-3000}..."
# Use the local next binary directly
./node_modules/.bin/next start
