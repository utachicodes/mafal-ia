// Lazy Prisma loader to avoid bundling @prisma/client at build time on Vercel.
type PrismaClientType = any
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

const isProd = process.env.NODE_ENV === 'production'

// Decide database URL: in production REQUIRE DATABASE_URL; in dev allow SQLite fallback
let resolvedDbUrl = process.env.DATABASE_URL
if (!resolvedDbUrl || resolvedDbUrl.length === 0) {
  if (isProd) {
    throw new Error(
      'DATABASE_URL is not set in production. Please configure a Postgres connection string in your environment (and Vercel project settings).'
    )
  }
  // Dev-only SQLite fallback for convenience
  const sqlitePath = process.cwd() + '/prisma/dev.db'
  resolvedDbUrl = `file:${sqlitePath}?connection_limit=1`
}
process.env.DATABASE_URL = resolvedDbUrl

export async function getPrisma(): Promise<PrismaClientType> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma!
  
  console.log(`Connecting to database at: ${process.env.DATABASE_URL}`);
  
  // Dynamic import to avoid build-time resolution
  const { PrismaClient } = await import('@prisma/client')
  
  const client = new PrismaClient({
    log: isProd 
      ? ['error', 'warn'] 
      : ['query', 'info', 'warn', 'error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

  // Test the connection
  try {
    await client.$connect();
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }

  if (!isProd) globalForPrisma.prisma = client;
  return client;
}
