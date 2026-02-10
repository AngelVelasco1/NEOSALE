# ============================================
# STAGE 1: BUILDER
# ============================================
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy root package files
COPY package.json bun.lock* ./

# Copy package files from services
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN cd frontend && bun install --frozen-lockfile --no-save

WORKDIR /app

# Copy source code
COPY . .

# Build Next.js application
WORKDIR /app/frontend
RUN bun run build

# ============================================
# STAGE 2: RUNTIME
# ============================================
FROM oven/bun:latest

WORKDIR /app

# Install dumb-init for proper signal handling and curl for health checks
RUN apt-get update && apt-get install -y dumb-init curl && rm -rf /var/lib/apt/lists/*

# Copy only necessary files from builder
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/package.json ./
COPY --from=builder /app/frontend/bun.lock* ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile --no-save

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN useradd -m -u 1001 nextjs && chown -R nextjs:nextjs /app

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly (PID 1)
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js app
CMD ["bun", "start"]
