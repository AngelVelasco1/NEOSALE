#!/bin/bash
set -e

echo "==> Building NEOSALE Frontend with Bun..."

# Install root dependencies
bun install --frozen-lockfile

# Build frontend
cd frontend
bun install --frozen-lockfile
bun run build

echo "==> Build complete!"
