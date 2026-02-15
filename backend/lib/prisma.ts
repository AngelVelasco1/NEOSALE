// Prisma v7 - PostgreSQL with PrismaPg adapter
// WARNING: dotenv MUST be loaded in app.ts BEFORE this file is imported
import { PrismaClient } from '../prisma/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalThis_ = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

console.log('[Prisma] Loading...')
console.log('[Prisma] process.env.DATABASE_URL:', process.env.DATABASE_URL)

// Validate DATABASE_URL
const databaseUrl = process.env.DATABASE_URL

console.log('[Prisma] Parsed databaseUrl:', databaseUrl)
console.log('[Prisma] Type of databaseUrl:', typeof databaseUrl)

if (!databaseUrl || typeof databaseUrl !== 'string') {
  throw new Error(
    `DATABASE_URL is invalid: ${databaseUrl} (type: ${typeof databaseUrl})`
  )
}

console.log('[Prisma] Creating PrismaPg adapter...')

// Try creating adapter with connection string directly
const adapter = new PrismaPg({ 
  connectionString: databaseUrl 
})

console.log('[Prisma] Creating PrismaClient...')

// Create Prisma Client
const prismaClient = new PrismaClient({
  adapter: adapter,
})

console.log('[Prisma] ✓ PrismaClient created')

export const prisma = globalThis_.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') {
  globalThis_.prisma = prisma
}
