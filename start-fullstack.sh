#!/bin/bash
set -e

echo "=== Starting NEOSALE Full Stack ==="

# Start Backend in background on port 8000
echo "Starting Backend on port 8000..."
cd backend
export PORT=8000
nohup bun dist/app.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
sleep 2  # Give backend time to start

# Start Frontend on port 3000 (foreground)
echo "Starting Frontend on port 3000..."
cd ../frontend
export PORT=3000
echo "Frontend starting..."
exec ./node_modules/.bin/next start
