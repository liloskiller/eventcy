import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  const { userId, eventId } = await req.json();

  const qrCode = uuidv4();

  const ticket = await prisma.ticket.create({
    data: { userId, eventId, qrCode },
  });

  const qrImage = await QRCode.toDataURL(qrCode);

  return NextResponse.json({ ticket, qrImage });
}
