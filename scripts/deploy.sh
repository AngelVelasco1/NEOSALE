#!/bin/bash
# Production deployment script
# Usage: ./deploy.sh <environment> <tag>

set -e

ENVIRONMENT=${1:-staging}
TAG=${2:-latest}
REGISTRY=${REGISTRY:-ghcr.io/your-org}

echo "🚀 Deploying to $ENVIRONMENT..."
echo "=============================="

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Invalid environment. Use 'staging' or 'production'"
  exit 1
fi

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
  export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
else
  echo "⚠️  .env.$ENVIRONMENT not found"
fi

# 1. Build images
echo ""
echo "📦 Building images..."
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml build

# 2. Push to registry
echo ""
echo "📤 Pushing images to registry..."
docker tag neosale-api:$TAG $REGISTRY/neosale-api:$TAG
docker tag neosale-web:$TAG $REGISTRY/neosale-web:$TAG
docker push $REGISTRY/neosale-api:$TAG
docker push $REGISTRY/neosale-web:$TAG

# 3. Deploy (via Docker Swarm, Kubernetes, or cloud provider)
echo ""
echo "🔄 Deploying containers..."
# Example for Docker Swarm:
# docker stack deploy -c docker-compose.yml -c docker-compose.$ENVIRONMENT.yml neosale

# For other platforms, add deployment commands here

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Check deployment status:"
echo "  docker service ls         (Docker Swarm)"
echo "  kubectl get pods          (Kubernetes)"
