import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET as string

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id.toString(), email: user.email },
      SECRET_KEY,
      { expiresIn: '1d' }
    )

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}