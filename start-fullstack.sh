#!/bin/bash
set -e

echo "=== STARTING NEOSALE FULL STACK ==="

# Crear archivo temporal para tracking
BACKEND_PID_FILE="/tmp/backend.pid"
BACKEND_LOG="/tmp/backend.log"

# Cleanup en salida
cleanup() {
  echo "Stopping services..."
  if [ -f "$BACKEND_PID_FILE" ]; then
    BACKEND_PID=$(cat "$BACKEND_PID_FILE")
    echo "Killing backend PID: $BACKEND_PID"
    kill $BACKEND_PID 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Iniciar Backend en background
echo "Starting Backend on port ${BACKEND_PORT:-8000}..."
cd backend
export PORT=${BACKEND_PORT:-8000}
export NODE_ENV=production
bun dist/app.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$BACKEND_PID_FILE"
echo "Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo
echo "Waiting for backend to start..."
for i in {1..30}; do
  if curl -s http://localhost:${BACKEND_PORT:-8000}/ > /dev/null 2>&1; then
    echo "Backend is ready!"
    break
  fi
  echo "Attempt $i: Backend not ready yet, waiting..."
  sleep 1
done

# Iniciar Frontend en foreground (MUST be foreground for Render)
echo "Starting Frontend on port ${PORT:-3000}..."
cd ../frontend
export PORT=${PORT:-3000}
export NODE_ENV=production
echo "Frontend starting..."
exec ./node_modules/.bin/next start
