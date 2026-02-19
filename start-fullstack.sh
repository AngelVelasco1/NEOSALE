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

# Use the port that Render assigns (via $PORT environment variable)
# Render will assign a dynamic port - we use it for the frontend
# Backend stays on internal port 8000
FRONTEND_PORT=${PORT:-3000}

# Iniciar Backend en background
echo "Starting Backend on port 8000..."
cd backend
export NODE_ENV=production
# Pass PORT inline for backend (internal only), don't export it globally
PORT=8000 bun dist/app.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$BACKEND_PID_FILE"
echo "Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo (aumentado a 60 intentos = 60 segundos)
echo "Waiting for backend to start..."
BACKEND_READY=0
for i in {1..60}; do
  # Try to access any API endpoint - just check if port 8000 is responding
  if timeout 2 curl -s http://localhost:8000/api/products/featured >/dev/null 2>&1 || timeout 2 curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/products 2>/dev/null | grep -q "200\|304"; then
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
echo "Starting Frontend on port $FRONTEND_PORT..."
cd ../frontend
export PORT=$FRONTEND_PORT
export NODE_ENV=production
echo "Frontend starting..."
exec ./node_modules/.bin/next start
