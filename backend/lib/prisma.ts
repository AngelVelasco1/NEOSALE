import { PrismaClient } from '../prisma/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const globalThis_ = globalThis as unknown as {
  prisma: PrismaClient | undefined
}


// Validate DATABASE_URL
const databaseUrl = process.env.DATABASE_URL



if (!databaseUrl || typeof databaseUrl !== 'string') {
  throw new Error(
    `DATABASE_URL is invalid: ${databaseUrl} (type: ${typeof databaseUrl})`
  )
}


// Try creating adapter with connection string directly
const adapter = new PrismaPg({ 
  connectionString: databaseUrl 
})


// Create Prisma Client
const prismaClient = new PrismaClient({
  adapter: adapter,
})


export const prisma = globalThis_.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') {
  globalThis_.prisma = prisma
}
