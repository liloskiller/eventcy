import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET as string

export async function POST(request: Request) {
  try {
    const { email, password_hash } = await request.json()

    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password_hash, user.password_hash)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

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