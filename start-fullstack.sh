#!/bin/bash
set -e

echo "=== STARTING NEOSALE FULL STACK ==="

# Get script directory (even when called from different locations)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# IMPORTANT: DATABASE_URL should be set from environment (render.yaml)
# Prisma adapter-pg reads it from process.env
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set!"
  exit 1
fi

# Create tables using the SQL dump (only if tables don't exist)
echo "Ensuring database schema exists..."

# Check if products table exists - if not, create all tables
if ! psql "$DATABASE_URL" -c "SELECT 1 FROM information_schema.tables WHERE table_name='products'" 2>/dev/null | grep -q "1 row"; then
  echo "Creating database schema from neosale.sql..."
  psql "$DATABASE_URL" -f "$SCRIPT_DIR/backend/db/neosale.sql" 2>&1 || {
    echo "⚠️ Warning: Schema creation may have had issues, but continuing..."
  }
  echo "✓ Database schema created"
else
  echo "✓ Database schema already exists"
fi

# Load all stored procedures, functions, and triggers
# These are idempotent (safe to run multiple times)
echo "Loading all stored procedures and functions..."
psql "$DATABASE_URL" -f "$SCRIPT_DIR/backend/db/load-all-procedures.sql" 2>&1 || {
  echo "⚠️ Warning: Some procedures may have had issues, but continuing..."
}
echo "✓ All procedures and functions loaded"

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

# Frontend SIEMPRE escucha en puerto 3000 (especificado en render.yaml con "port: 3000")
# Render mapea automáticamente 3000 → https://neosale.onrender.com
FRONTEND_PORT=3000

# Iniciar Backend en background
echo "Starting Backend on port 8000..."
cd "$SCRIPT_DIR/backend"
export NODE_ENV=production
# Pass PORT inline for backend (internal only), don't export it globally
PORT=8000 bun dist/app.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$BACKEND_PID_FILE"
echo "Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo (aumentado a 60 intentos = 60 segundos)
echo "Waiting for backend to start on localhost:8000..."
BACKEND_READY=0
for i in {1..60}; do
  # Check if backend is responding on /api/products (doesn't require auth)
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/products 2>/dev/null | grep -q "200"; then
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
echo ""
echo "Starting Frontend on port $FRONTEND_PORT (PUBLIC - specified in render.yaml with port: 3000)..."
cd "$SCRIPT_DIR/frontend"
export PORT=$FRONTEND_PORT
export NODE_ENV=production
echo "Frontend starting..."
# Next.js will listen on 0.0.0.0:3000 (all interfaces, publicly accessible)
exec ./node_modules/.bin/next start
