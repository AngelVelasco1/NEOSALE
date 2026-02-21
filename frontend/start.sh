#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Starting NEOSALE Frontend..."
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  bun install --frozen-lockfile
fi

# Check if .next exists
if [ ! -d ".next" ]; then
  echo ".next not found, building application..."
  bun run build
fi

# Check if next is available
if ! command -v next &> /dev/null; then
  echo "ERROR: next command not found!"
  echo "Attempting to install globally..."
  bun install -g next
fi

echo "Starting Next.js server..."
# Start with bun instead of npx for better compatibility
bun run next start
