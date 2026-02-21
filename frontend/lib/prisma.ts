// Prisma v7 - PostgreSQL with PrismaPg adapter
// This file is server-only to prevent bundling for client components
import 'server-only'
import 'dotenv/config'
import { PrismaClient } from '@/prisma/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

// Create Prisma Client with PrismaPg adapter
// Pass connectionString directly to PrismaPg - it handles pool creation internally
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
