import { NextResponse } from 'next/server'
import { getPrisma } from '@/src/lib/db'
import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'

export async function POST(request: Request) {
  try {
    console.log('Signup request received')
    const { email, name, password } = await request.json()
    
    if (!email || !name || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { message: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    console.log('Getting Prisma client...')
    const prisma = await getPrisma()
    console.log('Prisma client obtained')
    
    // Check if user already exists
    console.log('Checking for existing user...')
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email }
    })
    console.log('Existing user check complete:', existingUser ? 'found' : 'not found')

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    try {
      // Hash password
      console.log('Hashing password...')
      const hashedPassword = await bcrypt.hash(password, 12)
      console.log('Password hashed')

      // Create user
      console.log('Creating user...')
      const user: User = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword
        }
      })
      console.log('User created:', user.id)

      return NextResponse.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      })
    } catch (dbError) {
      console.error('Database error during signup:', dbError)
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to create user',
          error: process.env.NODE_ENV === 'development' ? String(dbError) : undefined
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error in signup:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
