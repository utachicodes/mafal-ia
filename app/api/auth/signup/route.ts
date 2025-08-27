import { NextResponse } from 'next/server'
import { getPrisma } from '@/src/lib/db'
import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()
    
    if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    const prisma = await getPrisma()
    
    // Check if user already exists
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user: User = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword
      }
    })

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
