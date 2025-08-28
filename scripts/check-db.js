const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

async function checkDatabase() {
  console.log('Checking database...');
  
  // Check if database file exists
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  console.log(`Database path: ${dbPath}`);
  console.log(`Database exists: ${fs.existsSync(dbPath) ? 'Yes' : 'No'}`);
  
  // Try to connect to the database
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Check if User table exists
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%' 
      AND name NOT LIKE '_prisma_%';
    `;
    
    console.log('\nTables in database:');
    console.table(tables);
    
    // Check User table structure
    if (tables.some(t => t.name === 'User')) {
      const userTableInfo = await prisma.$queryRaw`PRAGMA table_info(User);`;
      console.log('\nUser table structure:');
      console.table(userTableInfo);
      
      // Check if we can query users
      const users = await prisma.user.findMany({
        take: 5,
        select: { id: true, email: true, name: true }
      });
      console.log('\nFirst 5 users:');
      console.table(users);
    }
    
  } catch (error) {
    console.error('\nError checking database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
