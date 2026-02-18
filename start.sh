#!/bin/bash
set -e

echo "==> Starting NEOSALE Frontend"

# Go to frontend directory
cd frontend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  bun install --frozen-lockfile
fi

# Check if app is built
if [ ! -d ".next" ]; then
  echo "Building application..."
  bun run build
fi

echo "==> Starting on port ${PORT:-3000}..."
# Use bun to run the start script from package.json
bun run start

