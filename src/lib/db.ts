import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot reloads in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const isProd = process.env.NODE_ENV === 'production'

// Provide a default SQLite URL if none is set, to support demo deployments
if (!process.env.DATABASE_URL) {
  // Use the local dev db under prisma/dev.db
  process.env.DATABASE_URL = 'file:./prisma/dev.db'
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: isProd ? ["error", "warn"] : ["query", "info", "warn", "error"],
})

if (!isProd) globalForPrisma.prisma = prisma
