# 🚀 Quick Start Guide - NEOSALE Docker Setup

## Requisitos Previos
- Docker Desktop instalado
- Docker Compose ≥ 2.0
- Git
- 4GB RAM mínimos (8GB recomendado)
- 20GB espacio libre en disco

## ⚡ Inicio Rápido (5 minutos)

### 1. Clonar y Preparar
```bash
git clone <tu-repo>
cd NEOSALE
cp .env.example .env
```

### 2. Configurar Variables de Entorno
```bash
# .env 
POSTGRES_PASSWORD=tu_password_seguro
REDIS_PASSWORD=tu_redis_password
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Iniciar Todo
```bash
# Opción A: Con Make (recomendado)
make dev

# Opción B: Con Docker Compose
docker-compose up -d

# Opción C: Con Script
bash scripts/dev-start.sh
```

### 4. Verificar Estado
```bash
make ps
# o
docker-compose ps
```

¡Listo! Ahora puedes acceder a:
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend**: http://localhost:3001
- 🗄️ **PostgreSQL**: localhost:5432
- 🚀 **Redis**: localhost:6379

---

## 📖 Comandos Más Útiles

### Desarrollo
```bash
make logs              # Ver logs en tiempo real
make logs-api          # Logs solo del backend
make logs-web          # Logs solo del frontend
make shell-api         # Terminal interactiva en API
make shell-db          # Conectarse a PostgreSQL
```

### Base de Datos
```bash
make db-init           # Correr migraciones
make db-reset          # Resetear DB (⚠️ borra datos)
make db-seed           # Popular con datos de prueba
make prisma-generate   # Regenerar cliente de Prisma
```

### Compilación y Optimización
```bash
make build             # Buildear imágenes Docker
make analyze           # Bundle analyzer de Next.js
make perf-check        # Verificar performance
```

### Limpieza
```bash
make down              # Parar servicios
make clean             # Eliminar todo (containers + volumes)
```

---

## 📊 Estructura de Contenedores

```
┌──────────────────────────────────────────────┐
│         Docker Compose Network               │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Frontend │  │  Backend │  │   NGINX  │  │
│  │ (Port    │  │ (Port    │  │ (Port    │  │
│  │   3000)  │  │   3001)  │  │ 80/443)  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│       │              │                       │
│       └──────┬───────┘                       │
│              ▼                               │
│        ┌──────────────┐                      │
│        │ PostgreSQL   │  ┌──────────────┐  │
│        │ (Port 5432)  │  │   Redis      │  │
│        └──────────────┘  │ (Port 6379)  │  │
│                          └──────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 🔧 Configuración Detallada

### Variables de Entorno Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001      # URL del backend
NEXT_PUBLIC_APP_URL=http://localhost:3000      # URL del frontend
NEXT_TELEMETRY_DISABLED=1                      # Deshabilitar telemetría
```

### Variables de Entorno Backend
```bash
DATABASE_URL=postgresql://...                  # Conexión a PG
REDIS_URL=redis://...                          # Conexión a Redis
API_ORIGIN=http://localhost:3000              # CORS origen
PORT=3001                                      # Puerto del servidor
LOG_LEVEL=info                                 # Nivel de logs
```

---

## 🚨 Solución de Problemas

### "Ports already in use"
```bash
# Cambiar puertos en .env
WEB_PORT=3001
API_PORT=3002
DB_PORT=5433
```

### "Database connection refused"
```bash
# Esperar a que PostgreSQL esté listo
docker-compose logs postgres
# Si sigue fallando:
docker-compose exec postgres pg_isready
```

### "Out of memory"
```bash
# Aumentar límites de recursos en docker-compose.yml
# O reducir límites de caché en Redis
```

### "Build context too large"
```bash
# El .dockerignore ya está optimizado, pero verifica:
cat .dockerignore
```

---

## 📈 Optimizaciones Implementadas

### Frontend
✅ Multi-stage Docker build (reduce ~70% tamaño imagen)
✅ Production source maps deshabilitados
✅ Compression middleware
✅ Static asset optimization
✅ Image optimization con Next.js
✅ Code splitting automático
✅ Bundle analyzer integrado

### Backend
✅ Bun runtime (más rápido que Node.js)
✅ Prisma con connection pooling
✅ Redis caching
✅ Health checks
✅ Graceful shutdown
✅ Non-root user execution

### Docker
✅ Health checks en todos los servicios
✅ Resource limits configurados
✅ Logging centralizado
✅ Networking optimizado
✅ Volume management
✅ Restart policies

---

## 🚀 Deployment a Producción

### Preparar para Producción
```bash
# 1. Actualizar .env con valores reales
# 2. Generar NEXTAUTH_SECRET seguro
openssl rand -base64 32

# 3. Usar Docker Compose con override
docker-compose -f docker-compose.yml \
                -f docker-compose.prod.yml \
                up -d
```

### Opciones de Hosting
- **AWS ECS**: Compatible directo con Docker Compose
- **DigitalOcean App Platform**: Soporta compose files
- **Render**: Drag & drop deployment
- **Railway**: Detección automática
- **Vercel** (Frontend) + **Render/Railway** (Backend)

---

## 📚 Archivos de Referencia

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Orquestación de servicios |
| `frontend/Dockerfile` | Imagen Next.js optimizada |
| `backend/Dockerfile` | Imagen backend optimizada |
| `.dockerignore` | Reduce tamaño de build context |
| `nginx/nginx.conf` | Reverse proxy y balanceo |
| `Makefile` | Comandos simplificados |
| `OPTIMIZATION_GUIDE.md` | Guía detallada |
| `.env.example` | Template de variables |

---

## 🔗 Enlaces Útiles

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Redis Docker](https://hub.docker.com/_/redis/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres/)

---

## ✅ Checklist Antes de Producción

- [ ] Variables de entorno configuradas correctamente
- [ ] Secrets seguros (NEXTAUTH_SECRET, DB_PASSWORD, etc)
- [ ] CORS configurado correctamente
- [ ] Database backups automáticos
- [ ] Logging centralized (Sentry, New Relic, etc)
- [ ] SSL certificates configurados
- [ ] Health checks funcionan
- [ ] Load balancing configurado (nginx o cloud provider)
- [ ] Monitoring y alertas setup
- [ ] Rate limiting implementado

---

**¿Preguntas?** Revisa `OPTIMIZATION_GUIDE.md` para detalles técnicos.
