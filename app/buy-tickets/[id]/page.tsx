'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DarkModeToggle from '@/components/DarkModeToggle'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import PaymentForm from '@/components/PaymentForm'
import BackButton from '@/components/BackButton'
import { useAuth } from '@/context/AuthContext'

interface Event {
  id: string
  name: string
  date: string
  location: string
  price: number
  image?: string
  maxTickets: number
  seatingEnabled: boolean
}

export default function TicketPurchasePage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error('Event not found')
        }
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        router.push('/buy-tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  const handlePaymentSuccess = async () => {
    try {
      if (!user || !event) return

      // Create ticket in database
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create ticket')
      }

      const ticket = await response.json()
      setTicketData(ticket)
      setShowQRCode(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ticket')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white">Loading event details...</div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white bg-red-500 p-4 rounded">{error || 'Event not found'}</div>
      </div>
    )
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
                src={event.image || "/placeholder.svg"}
                alt={event.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
              <p className="text-xl font-bold">Price: €{event.price}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Seating: {event.seatingEnabled ? 'Reserved' : 'General Admission'}
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {!showQRCode ? (
                <PaymentForm 
                  amount={event.price} 
                  onSuccess={handlePaymentSuccess} 
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Your Ticket QR Code</h3>
                  {ticketData && (
                    <QRCodeGenerator 
                      data={ticketData.qrCode}
                    />
                  )}
                  <p className="text-sm">Please show this QR code at the entrance.</p>
                  <p className="text-sm text-gray-500">Ticket ID: {ticketData?.id}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}