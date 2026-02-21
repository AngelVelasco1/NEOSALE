# 🏗️ Arquitectura Visual - NEOSALE Stack

## Diagrama de Servicios

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTP/HTTPS
                    ┌────────────▼────────────┐
                    │   NGINX Reverse Proxy   │
                    │   (Load Balancer)       │
                    │   Port: 80/443          │
                    └─┬──────────────────────┬┘
           ┌──────────┘                    └──────────┐
           │                                          │
    ┌──────▼────────┐                        ┌───────▼──────┐
    │ Next.js Frontend                       │ Express Backend
    │ (Server Components)                    │ (API Routes)
    │ Port: 3000                             │ Port: 3001
    │ TanStack Query                         │ Prisma ORM
    │ MultiComponent                         │ Redis Cache
    │ Server Actions                         │ Middlewares
    └──────┬─────────┘                       └───────┬──────┘
           │                                         │
           │         ┌─────────────────┐           │
           │         │   Redis Cache   │           │
           │         │   Port: 6379    │           │
           │         │   (Session, Cache)         │
           │         └────────┬────────┘           │
           │                  │                     │
           └─────────┬────────┴─────────┬───────────┘
                     │                  │
              ┌──────▼──────────────────▼──────┐
              │   PostgreSQL Database          │
              │   Port: 5432                   │
              │   - Users                      │
              │   - Products                   │
              │   - Orders                     │
              │   - Transactions               │
              └────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             Docker Network (neosale-network)                │
│  All services communicate internally (no port exposure)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Comunicación

### 1️⃣ Request del Cliente

```
Browser Request
    ↓
NGINX (TCP 80/443)
    ├─→ /api/*       → Express Backend (TCP 3001)
    └─→ /*           → Next.js Frontend (TCP 3000)
```

### 2️⃣ Frontend → Backend

```
Next.js Server Component (getServerSideProps, etc)
    ↓
axios/fetch request to http://api:3001
    ↓
Express Route Handler
    ├─→ Query Database (Prisma)
    ├─→ Check Redis Cache
    └─→ Response JSON
```

### 3️⃣ Backend → Database

```
Express Handler
    ↓
Prisma Client (optimizado con Accelerate)
    ├─→ Connection Pool (internal)
    ├─→ Check Redis antes de query
    └─→ PostgreSQL (si no está en cache)
```

---

## Deployment Flow

### Development
```
Local Machine
    ↓
docker-compose up
    ↓
Port: 3000 (Frontend)
Port: 3001 (Backend)
Port: 5432 (DB)
Port: 6379 (Redis)
```

### Staging
```
Cloud Provider (DigitalOcean, AWS, etc)
    ↓
docker-compose -f docker-compose.yml \
                -f docker-compose.staging.yml up
    ↓
Single Instance (Cost-effective)
Auto-restart on failure
```

### Production
```
Cloud Provider (AWS ECS, Kubernetes, etc)
    ↓
docker-compose -f docker-compose.yml \
                -f docker-compose.prod.yml up
    ↓
Multi-Instance (API: 2+, Web: 2+)
Auto-scaling policies
Load balancing
Monitoring & Alerts
```

---

## Componentes Detallados

### Frontend (Next.js)
```
Dockerfile (Multi-stage)
    │
    ├─→ Stage 1: Builder
    │   ├─ FROM oven/bun:latest
    │   ├─ COPY package.json
    │   ├─ RUN bun install
    │   └─ RUN bun run build
    │
    └─→ Stage 2: Runtime
        ├─ FROM oven/bun:latest (fresh image)
        ├─ COPY .next/ (from builder)
        ├─ RUN bun install --production
        ├─ EXPOSE 3000
        ├─ HEALTHCHECK GET /api/health
        └─ CMD ["bun", "start"]

Tamaño: ~200MB (vs 500MB con single-stage)
```

### Backend (Express)
```
Dockerfile (Multi-stage)
    │
    ├─→ Stage 1: Builder
    │   ├─ FROM oven/bun:latest
    │   ├─ COPY package.json
    │   ├─ RUN bun install
    │   └─ RUN bun build app.ts --target node
    │
    └─→ Stage 2: Runtime
        ├─ FROM oven/bun:latest
        ├─ COPY dist/ (from builder)
        ├─ RUN bun run prisma generate
        ├─ EXPOSE 3001
        ├─ HEALTHCHECK GET /health
        └─ CMD ["bun", "dist/app.js"]

Tamaño: ~300MB
Startup: ~2-3 segundos
```

### PostgreSQL
```
Image: postgres:16-alpine
Storage: Named volume (postgres-data)
Config:
  - max_connections: 200
  - shared_buffers: 256MB
  - Connection logging disabled
Backup: Via pg_dump scripts
```

### Redis
```
Image: redis:7-alpine
Storage: Named volume (redis-data)
Config:
  - maxmemory: 256MB
  - maxmemory-policy: allkeys-lru
  - appendonly: yes (para persistencia)
  - requirepass: (credenciales)
```

### NGINX
```
Image: nginx:alpine
Funciones:
  - Reverse proxy (HTTP/HTTPS)
  - Load balancing (least_conn)
  - Rate limiting
  - Static asset caching
  - Gzip compression
  - Security headers
  - WebSocket support
```

---

## Data Flow - Ejemplo Completo

```
User visits https://neosale.com/products

1. NGINX (Public IP, Puerto 443)
   │
   ├─→ Route: /products (no /api/)
   │   └─→ Forward a web:3000
   │
   2. Next.js Frontend
      │
      ├─→ Server Component
      │   └─→ fetch('http://api:3001/api/products')
      │
      3. Express Backend (api:3001)
         │
         ├─→ GET /api/products Handler
         │   │
         │   ├─→ Check Redis cache
         │   │   └─→ Cache HIT: Return cached data
         │   │
         │   └─→ Cache MISS: Query Database
         │       │
         │       4. PostgreSQL
         │          │
         │          └─→ SELECT * FROM products
         │              WHERE active = true
         │              ORDER BY created_at DESC
         │              LIMIT 50
         │
         ├─→ Store in Redis (expire: 1 hour)
         │
         └─→ Return JSON Response
            │
         5. Next.js Renders HTML
            │
            └─→ Send to Browser
               │
               └─→ Client sees 🎉
```

---

## Ciclo de Deploy

### 1. Local Development
```
make dev
    ↓
docker-compose up -d
    ↓
Services ready (localhost:3000)
```

### 2. Code Push
```
git push origin feature-branch
    ↓
GitHub Actions Triggered
    ├─→ Lint & Type check
    ├─→ Build Docker images
    ├─→ Push to GHCR.io
    └─→ Run smoke tests
```

### 3. PR Review & Merge
```
Create Pull Request
    ↓
Review & Approval
    ↓
Merge to main
    ↓
GitHub Actions:
    ├─→ Build release images
    ├─→ Push tagged version
    └─→ Alert deployment ready
```

### 4. Staging Deploy
```
docker-compose -f docker-compose.yml \
                -f docker-compose.staging.yml up -d
    ↓
Auto health checks pass
    ↓
Run E2E tests
    ↓
Manual approval or auto-promote
```

### 5. Production Deploy
```
docker-compose -f docker-compose.yml \
                -f docker-compose.prod.yml up -d
    ↓
Blue-Green Deployment:
    ├─→ Old version running (BLUE)
    ├─→ New version starting (GREEN)
    ├─→ Wait for health checks
    ├─→ Switch traffic to GREEN
    └─→ Keep BLUE for quick rollback
```

---

## Requisitos de Recursos

### Development (Local)
```
CPU: 4+ cores
RAM: 8GB mínimo
Disk: 20GB libre
Network: Localhost
```

### Staging
```
CPU: 2 cores
RAM: 1-2GB
Disk: 50GB
Network: Cloud provider
```

### Production
```
CPU: 4-8 cores
RAM: 4-8GB
Disk: 100GB+
Network: Multi-region
Load balancer: Yes
```

---

## Health Checks

Todos los servicios tienen health checks:

```
Frontend:     GET http://localhost:3000/api/health
Backend:      GET http://localhost:3001/health  
PostgreSQL:   pg_isready -U neosale
Redis:        redis-cli ping
```

Docker auto-restart si fails:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "..."]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## Seguridad por Capas

```
┌─────────────────────────────────────┐
│ Layer 1: Network (Docker Network)   │
│ ├─ Isolated network (neosale-net)   │
│ └─ Internal communication only       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Layer 2: Container Security         │
│ ├─ Non-root user execution          │
│ ├─ Read-only filesystems            │
│ └─ Resource limits (CPU, RAM)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Layer 3: Application Security       │
│ ├─ CORS validation                  │
│ ├─ Input validation (Zod)           │
│ ├─ Rate limiting (Nginx)            │
│ └─ SQL injection prevention (Prisma)│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Layer 4: Data Security              │
│ ├─ Encrypted at rest (TLS)          │
│ ├─ Encrypted in transit (HTTPS)     │
│ ├─ Secrets in env variables         │
│ └─ Database backups (automated)     │
└─────────────────────────────────────┘
```

---

## Performance Optimizations

### Frontend
```
✅ Multi-stage Docker build (-60% size)
✅ Next.js server-side rendering
✅ TanStack Query for caching
✅ Image optimization
✅ Code splitting
✅ Compression (gzip)
```

### Backend
```
✅ Connection pooling (Prisma Accelerate)
✅ Redis caching layer
✅ Compression middleware
✅ Rate limiting
✅ Request validation
✅ Efficient database indexes
```

### Database
```
✅ Connection pooling
✅ Query optimization
✅ Indexes on common queries
✅ Redis for hot data
✅ Partitioning (ready)
```

---

**Diagrama actualizado: 2024-02-10**
