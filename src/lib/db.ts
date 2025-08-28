// Lazy Prisma loader to avoid bundling @prisma/client at build time on Vercel.
type PrismaClientType = any
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

const isProd = process.env.NODE_ENV === 'production'

// Set default SQLite database path
const dbPath = process.cwd() + '/prisma/dev.db';
process.env.DATABASE_URL = `file:${dbPath}?connection_limit=1`;

export async function getPrisma(): Promise<PrismaClientType> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma!
  
  console.log(`Connecting to database at: ${dbPath}`);
  
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
