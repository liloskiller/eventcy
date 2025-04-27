import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await auth()

  if (!user || user.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const data = await req.json()

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

  return NextResponse.json(event)
}
