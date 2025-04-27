import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET as string

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("Authorization")
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const token = authorization.split(" ")[1]
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; email: string }

    const user = await prisma.users.findUnique({
      where: { id: parseInt(decoded.userId) },
      select: { role: true }
    })

    if (!user || user.role !== 'staff') {
      return NextResponse.json({ error: "Forbidden: Staff only" }, { status: 403 })
    }

    const data = await request.json()
    const event = await prisma.event.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        price: data.price,
        maxTickets: data.maxTickets,
        seatingEnabled: data.seatingEnabled,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}