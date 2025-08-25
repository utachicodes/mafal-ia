// Lazy Prisma loader to avoid bundling @prisma/client at build time on Vercel.
// This prevents the ".prisma/client/default" module-not-found error when scripts are blocked.
type PrismaClientType = any
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

const isProd = process.env.NODE_ENV === 'production'

// Provide a default SQLite URL if none is set, to support demo deployments
if (!process.env.DATABASE_URL) {
  // Use the local dev db under prisma/dev.db
  process.env.DATABASE_URL = 'file:./prisma/dev.db'
}

export async function getPrisma(): Promise<PrismaClientType> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma!
  // Dynamic import so Next won't try to resolve @prisma/client at build time
  const mod = await import('@prisma/client')
  const PrismaClient = mod.PrismaClient
  const client = new PrismaClient({
    log: isProd ? ["error", "warn"] : ["query", "info", "warn", "error"],
  })
  if (!isProd) globalForPrisma.prisma = client
  return client
}
