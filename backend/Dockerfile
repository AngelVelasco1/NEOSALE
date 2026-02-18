# ============================================
# STAGE 1: BUILDER
# ============================================
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy root package files
COPY package.json bun.lock* ./

# Copy backend package.json
COPY backend/package.json ./backend/

# Install all dependencies (including dev for build)
RUN bun install --frozen-lockfile

# Copy backend source
COPY backend ./backend
COPY backend/prisma ./backend/prisma

# Build application
WORKDIR /app/backend
RUN bun build app.ts --outdir dist --target node

# ============================================
# STAGE 2: RUNTIME
# ============================================
FROM oven/bun:latest

WORKDIR /app

# Install dumb-init for signal handling and curl for health checks
RUN apt-get update && apt-get install -y dumb-init curl && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock* ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./prisma

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Generate Prisma Client
RUN bun run -i "bunx prisma generate"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Create non-root user for security
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly (PID 1)
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["bun", "dist/app.js"]
