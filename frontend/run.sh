#!/bin/bash
set -e

cd frontend

# ALWAYS install dependencies first (Render may not preserve node_modules)
echo "Installing dependencies..."
bun install

# Verify build exists
if [ ! -d ".next" ]; then
  echo "Building application..."
  bun run build
fi

echo "Starting Next.js..."
# Use direct path to next binary
exec ./node_modules/.bin/next start
