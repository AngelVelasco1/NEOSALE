#!/bin/bash
set -e

echo "==> Starting NEOSALE Frontend"
echo "==> Current directory: $(pwd)"

# Log environment
echo "==> NODE_ENV: $NODE_ENV"
echo "==> PORT: ${PORT:-3000}"

# Go to frontend directory
cd frontend

# Verify node_modules
if [ ! -d "node_modules" ]; then
  echo "⚠️  node_modules not found, installing..."
  bun install --frozen-lockfile
fi

# Verify .next build
if [ ! -d ".next" ]; then
  echo "⚠️  .next build not found, building..."
  bun run build
fi

# Verify next command
if ! echo "node_modules/.bin/next" | xargs stat &>/dev/null; then
  echo "⚠️  next binary not found in node_modules, installing..."
  bun install --frozen-lockfile
fi

echo "==> Starting Next.js server on port ${PORT:-3000}..."
# Use bun to run next start
bun run next start
