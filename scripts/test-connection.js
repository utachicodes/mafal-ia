const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function testConnection() {
  console.log('Testing database connection...');
  
  // Set the database URL explicitly
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
  
  console.log(`Database path: ${dbPath}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasourceUrl: process.env.DATABASE_URL,
  });
  
  try {
    // Test connection
    console.log('Connecting to database...');
    await prisma.$connect();
    
    // Test query
    console.log('Running test query...');
    const userCount = await prisma.user.count();
    console.log(`Success! Found ${userCount} users in the database.`);
    
    // List tables
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%' 
      AND name NOT LIKE '_prisma_%';
    `;
    
    console.log('\nTables in database:');
    console.table(tables);
    
  } catch (error) {
    console.error('Database connection error:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database.');
  }
}

testConnection();
