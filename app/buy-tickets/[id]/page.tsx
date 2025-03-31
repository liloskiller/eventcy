'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DarkModeToggle from '@/components/DarkModeToggle'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import PaymentForm from '@/components/PaymentForm'
import BackButton from '@/components/BackButton'

interface Ticket {
  id: number
  name: string
  date: Date
  location: string
  price: number
  image: string
}

const tickets: Ticket[] = [
  {
    id: 1,
    name: 'Summer Beach Party',
    date: new Date(2023, 6, 15),
    location: 'Nissi Beach, Ayia Napa',
    price: 30,
    image: '/beach-club.jpg'
  },
  {
    id: 2,
    name: 'Foam Party Extravaganza',
    date: new Date(2023, 6, 22),
    location: 'Club Aqua, Limassol',
    price: 25,
    image: '/foam-party.jpg'
  },
]

export default function TicketPurchasePage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const router = useRouter()

  useState(() => {
    const ticketId = parseInt(params.id)
    const foundTicket = tickets.find(t => t.id === ticketId)
    if (foundTicket) {
      setTicket(foundTicket)
    } else {
      router.push('/buy-tickets')
    }
  })

  const handlePaymentSuccess = () => {
    setShowQRCode(true)
  }

  if (!ticket) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6 font-sans">
      <BackButton />
      <DarkModeToggle />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">Purchase Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative h-48 sm:h-64 w-full">
              <Image
                src={ticket.image || "/placeholder.svg"}
                alt={ticket.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{ticket.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{ticket.date.toDateString()}</p>
              <p className="text-gray-600 dark:text-gray-300">{ticket.location}</p>
              <p className="text-xl font-bold">Price: €{ticket.price}</p>
            </div>
            
            <AnimatePresence mode="wait">
              {!showQRCode ? (
                <PaymentForm amount={ticket.price} onSuccess={handlePaymentSuccess} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Your Ticket QR Code</h3>
                  <QRCodeGenerator data={`Ticket: ${ticket.name}, Date: ${ticket.date.toDateString()}, Price: €${ticket.price}`} />
                  <p className="text-sm">Please show this QR code at the entrance. You can also find this in your email.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

