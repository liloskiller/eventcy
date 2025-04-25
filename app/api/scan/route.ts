import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'Missing QR code' }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({ where: { qrCode: code } });

  if (!ticket) {
    return NextResponse.json({ message: 'Invalid ticket' }, { status: 404 });
  }

  if (ticket.scanned) {
    return NextResponse.json({ message: 'Ticket already used' }, { status: 409 });
  }

  await prisma.ticket.update({
    where: { qrCode: code },
    data: { scanned: true, scannedAt: new Date() },
  });

  return NextResponse.json({ message: '✅ Ticket valid — enjoy the event!' });
}
