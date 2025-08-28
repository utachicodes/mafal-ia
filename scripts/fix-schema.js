const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function fixSchema() {
  console.log('Checking and fixing database schema...');
  
  // Set the database URL
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
  
  console.log(`Using database: ${dbPath}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Check if the User table exists
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name = 'User';
    `;
    
    if (tables.length === 0) {
      console.log('User table does not exist. Creating...');
      // Run migrations
      const { execSync } = require('child_process');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('Migrations applied successfully');
    } else {
      console.log('User table exists. Checking structure...');
      const columns = await prisma.$queryRaw`PRAGMA table_info(User);`;
      console.log('User table structure:');
      console.table(columns);
    }
    
    // Test user creation
    console.log('\nTesting user creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test User',
        passwordHash: 'test-hash-123' // In a real app, this would be hashed
      }
    });
    
    console.log('Successfully created test user:', user);
    
    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
    
  } catch (error) {
    console.error('Error checking/fixing schema:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database.');
  }
}

fixSchema();
