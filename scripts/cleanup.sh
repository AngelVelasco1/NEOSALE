#!/bin/bash
# Cleanup Docker environment and volumes

set -e

echo "🧹 Cleaning up NEOSALE Docker environment..."
echo "=============================================="

read -p "This will stop and remove all containers. Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  
  # Remove containers
  echo "Stopping containers..."
  docker-compose down
  
  # Optional: Remove volumes
  read -p "Remove volumes too? (This deletes database data) (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing volumes..."
    docker-compose down -v
  fi
  
  echo ""
  echo "✅ Cleanup complete!"
else
  echo "Aborted."
fi
