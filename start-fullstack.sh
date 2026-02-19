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
echo "Starting Backend on port 8000..."
cd backend
# Try to run migrations if they haven't been run yet
echo "Checking/running database migrations..."
bunx prisma migrate deploy --skip-generate 2>&1 || echo "⚠ Migrations skipped (may already be applied or DB not ready)"
export NODE_ENV=production
# Pass PORT inline for backend, don't export it globally
PORT=8000 bun dist/app.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$BACKEND_PID_FILE"
echo "Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo (aumentado a 60 intentos = 60 segundos)
echo "Waiting for backend to start..."
BACKEND_READY=0
for i in {1..60}; do
  if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✓ Backend is ready!"
    BACKEND_READY=1
    break
  fi
  echo "Attempt $i/60: Backend not ready yet, waiting..."
  sleep 1
done

# Si el backend no respondió, mostrar logs y fallar
if [ $BACKEND_READY -eq 0 ]; then
  echo "✗ Backend failed to start! Last logs:"
  tail -50 "$BACKEND_LOG"
  exit 1
fi

# Iniciar Frontend en foreground (MUST be foreground for Render)
echo "Starting Frontend on port 3000..."
cd ../frontend
export PORT=3000
export NODE_ENV=production
echo "Frontend starting..."
exec ./node_modules/.bin/next start
