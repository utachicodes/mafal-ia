// Lazy Prisma loader to avoid bundling @prisma/client at build time on Vercel.
type PrismaClientType = any
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

const isProd = process.env.NODE_ENV === 'production'

// Database URL validation delayed until access


export async function getPrisma(): Promise<PrismaClientType> {
  // Validate env var now
  const url = process.env.DATABASE_URL
  if (!url || url.length === 0) {
    throw new Error('DATABASE_URL is not set in .env file.')
  }

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
