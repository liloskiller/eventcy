// app/api/tickets/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const SECRET_KEY = process.env.JWT_SECRET as string

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authorization = request.headers.get("Authorization")
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const token = authorization.split(" ")[1]
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string }

    const { eventId, userId } = await request.json()

    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Generate unique QR code data
    const qrCodeData = uuidv4()

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        qrCode: qrCodeData,
        userId: parseInt(userId),
        eventId,
        scanned: false
      },
      include: {
        event: true,
        user: true
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Ticket creation error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    )
  }
}