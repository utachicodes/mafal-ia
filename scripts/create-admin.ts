import { PrismaClient, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { logger } from '../src/lib/logger';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@mafalia.com';
  const password = 'admin123'; // Temporary password - should be changed after first login
  const name = 'Admin User';

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      logger.info('Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create admin user with the correct role
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
      } as any, // Using type assertion to bypass TypeScript error temporarily
    });

    logger.info('Admin user created successfully', { email });
    
    // Log credentials in a way that's visible in the console but not in production logs
    const credentialsMessage = `\n=== Admin Credentials ===\nEmail: ${email}\nPassword: ${password}\n\nIMPORTANT: Please change this password after first login!\n=========================\n`;
    
    // Use console.log for the credentials since we want them to be visible in the console
    // but we don't want them in the production logs
    if (process.env.NODE_ENV !== 'production') {
      console.log(credentialsMessage);
    } else {
      logger.warn('Admin user created in production environment. Please change the default password immediately.');
    }
  } catch (error) {
    logger.error('Error creating admin user', error as Error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
