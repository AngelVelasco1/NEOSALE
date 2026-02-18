#!/bin/bash
set -e

echo "==> Build started for NEOSALE"
echo "==> Installing root dependencies..."
bun install --frozen-lockfile

echo "==> Installing frontend dependencies..."
cd frontend
bun install --frozen-lockfile
echo "==> Building Next.js application..."
bun run build

echo "==> Build completed successfully ✓"
