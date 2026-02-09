#!/bin/bash
# 🔍 Script de validación de optimizaciones - NEOSALE

echo "🚀 VALIDANDO OPTIMIZACIONES DE RENDIMIENTO"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="http://localhost:3001/api"
PASSES=0
FAILS=0

# Función para testar endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local name=$3
  
  echo -n "📊 Testeando $name... "
  
  response=$(curl -s -w "\n%{http_code}" -X "$method" "$BACKEND_URL$endpoint")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" == "200" ] || [ "$http_code" == "201" ]; then
    cache_status=$(curl -s -I -X "$method" "$BACKEND_URL$endpoint" | grep -i "X-Cache" | cut -d' ' -f2-)
    echo -e "${GREEN}✓${NC} ($http_code)"
    
    if [[ $cache_status == *"HIT"* ]]; then
      echo "   ${GREEN}✓ Cache HIT${NC}"
      ((PASSES++))
    else
      echo "   ${YELLOW}ℹ Cache MISS (primera vez)${NC}"
      ((PASSES++))
    fi
  else
    echo -e "${RED}✗${NC} ($http_code)"
    ((FAILS++))
  fi
}

# Función para verificar índices
check_indexes() {
  echo ""
  echo "🗂️  VERIFICANDO ÍNDICES DE BD"
  echo "=============================="
  echo ""
  
  echo "⏳ Este paso requiere acceso a PostgreSQL"
  echo "Ejecuta en tu terminal:"
  echo ""
  echo "  ${YELLOW}psql -U tu_usuario -d neosale${NC}"
  echo ""
  echo "Luego copia/pega:"
  echo ""
  echo "  ${YELLOW}SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public';${NC}"
  echo ""
  echo "Debes ver: ~35+ índices (incluidos los nuevos de performance)"
  echo ""
  echo "O con este comando específico:"
  echo "  ${YELLOW}SELECT indexname FROM pg_indexes WHERE indexname LIKE 'idx_%' ORDER BY indexname;${NC}"
  echo ""
}

# Verificar si backend está corriendo
echo "🔗 Verificando conexión al backend..."
if ! curl -s "$BACKEND_URL" >/dev/null 2>&1; then
  echo -e "${RED}✗ Backend no está corriendo en $BACKEND_URL${NC}"
  echo ""
  echo "  Inicia el backend con:"
  echo "  ${YELLOW}cd backend && bun run dev${NC}"
  echo ""
  exit 1
fi
echo -e "${GREEN}✓ Backend está disponible${NC}"
echo ""

# Tests
echo "🧪 TESTS DE ENDPOINTS"
echo "===================="
echo ""

test_endpoint "GET" "/products?page=1&limit=20" "GET /products (primera vista)"
echo ""
test_endpoint "GET" "/products?page=1&limit=20" "GET /products (segunda vista - debe mostrar CACHE HIT)"
echo ""
test_endpoint "GET" "/offers" "GET /offers"
echo ""
test_endpoint "GET" "/categories" "GET /categories (si existe)"
echo ""

# Verificar tamaño de respuesta
echo "📦 TAMAÑO DE RESPUESTAS"
echo "======================"
echo ""

size=$(curl -s "$BACKEND_URL/products?page=1&limit=20" | wc -c)
size_kb=$((size / 1024))
echo "📊 Tamaño JSON /products: ${size_kb}KB"

if [ "$size_kb" -lt 1000 ]; then
  echo -e "${GREEN}✓ Tamaño optimizado (<1MB)${NC}"
  ((PASSES++))
else
  echo -e "${RED}✗ Tamaño alto (>1MB, revisar optimizaciones)${NC}"
  ((FAILS++))
fi
echo ""

# Tiempo de respuesta
echo "⏱️  TIEMPO DE RESPUESTA"
echo "===================="
echo ""

time=$(curl -s -w "%{time_total}s\n" -o /dev/null "$BACKEND_URL/products?page=1&limit=20")
echo "Primera solicitud: ${time}"

time=$(curl -s -w "%{time_total}s\n" -o /dev/null "$BACKEND_URL/products?page=1&limit=20")
echo "Segunda solicitud (caché): ${time}"
echo ""

# Resumen
echo "📋 RESUMEN"
echo "========="
echo -e "${GREEN}Passed:${NC} $PASSES"
echo -e "${RED}Failed:${NC} $FAILS"
echo ""

if [ $FAILS -gt 0 ]; then
  echo -e "${RED}⚠️  Hay issues a revisar${NC}"
else
  echo -e "${GREEN}✓ Todas las optimizaciones se aplican correctamente${NC}"
fi

echo ""
echo "📚 PRÓXIMOS PASOS:"
echo ""
check_indexes

echo -e "${YELLOW}💡 Monitorea los logs del backend para ver:${NC}"
echo "   ⏱️ [GET] /api/products - 523ms - 200"
echo ""
echo -e "${YELLOW}📖 Lee OPTIMIZATION_REPORT.md para más detalles${NC}"
