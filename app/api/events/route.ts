import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { user } = await auth()

    if (!user || user.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Unauthorized: Staff access required' },
        { status: 403 }
      )
    }

    const data = await req.json()

    // Validate input data
    if (!data.name || !data.date || !data.location || !data.price || !data.maxTickets) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        price: parseFloat(data.price),
        maxTickets: parseInt(data.maxTickets),
        seatingEnabled: Boolean(data.seatingEnabled),
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}