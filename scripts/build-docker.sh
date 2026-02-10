#!/bin/bash
# Build and run Docker containers locally for development/testing

set -e

echo "🐳 Building NEOSALE Docker Images..."
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build parameters
BUILD_TAG=${1:-latest}
REGISTRY=${REGISTRY:-}

echo -e "${YELLOW}Building images with tag: ${BUILD_TAG}${NC}"

# Backend
echo -e "${YELLOW}[1/3] Building backend image...${NC}"
docker build \
  -t ${REGISTRY}neosale-api:${BUILD_TAG} \
  -f backend/Dockerfile \
  --cache-from type=local,src=/tmp/.buildx-cache \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .

# Frontend
echo -e "${YELLOW}[2/3] Building frontend image...${NC}"
docker build \
  -t ${REGISTRY}neosale-web:${BUILD_TAG} \
  -f frontend/Dockerfile \
  --cache-from type=local,src=/tmp/.buildx-cache \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .

# Show built images
echo -e "\n${GREEN}✓ Build complete!${NC}"
docker images | grep neosale

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Configure .env file with your settings"
echo "2. Run: docker-compose up -d"
echo "3. Check services: docker-compose ps"
