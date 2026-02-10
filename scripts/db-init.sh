#!/bin/bash
# Database initialization and migration script

set -e

echo "🗄️  Initializing Database..."
echo "============================="

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U neosale > /dev/null 2>&1; do
  sleep 1
done

echo "✓ PostgreSQL is ready"

# Run migrations
echo ""
echo "Running Prisma migrations..."
docker-compose exec -T api bun run prisma migrate deploy

# Seed database (optional)
if [ -f "backend/prisma/seed.ts" ]; then
  echo ""
  echo "Seeding database..."
  docker-compose exec -T api bun run prisma db seed
fi

echo ""
echo "✅ Database initialization complete!"
