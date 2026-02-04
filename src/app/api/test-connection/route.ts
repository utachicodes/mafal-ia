import { NextResponse } from 'next/server';
import { getPrisma } from '@/src/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Get Prisma client with the updated configuration
    const prisma = await getPrisma();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
