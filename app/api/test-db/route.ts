import { NextResponse } from 'next/server';
import { getPrisma } from '@/src/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const prisma = await getPrisma();
    
    // Try a simple query
    const users = await prisma.user.findMany({
      take: 1,
      select: { id: true, email: true }
    });
    
    console.log('Database connection successful. Users:', users);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      users
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
