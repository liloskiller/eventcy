'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

type Event = {
  id: string
  name: string
  date: string
  location: string
  price: number
  maxTickets: number
  ticketsSold: number
  seatingEnabled: boolean
}

export default function BuyTickets() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        // Calculate tickets remaining
        const eventsWithAvailability = data.map((event: any) => ({
          ...event,
          ticketsSold: 0, // You'll need to implement this from your database
          ticketsRemaining: event.maxTickets // - actual sold tickets
        }))
        setEvents(eventsWithAvailability)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // ... rest of your component remains the same
  // Just update the display to show ticketsRemaining
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6 font-sans">
      <BackButton />
      <motion.h1 
        className="text-4xl font-bold text-white text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Buy Tickets
      </motion.h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Available Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{event.name}</h3>
                <p className="text-gray-600 dark:text-gray-200">{new Date(event.date).toDateString()}</p>
                <p className="text-gray-600 dark:text-gray-200">{event.location}</p>
                <p className="text-gray-800 dark:text-gray-200 font-bold">Price: €{event.price ?? 'N/A'}</p>
                <Link href={`/buy-tickets/${event.id}`}>
                  <Button className="mt-2 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600">
                    Buy Ticket
                  </Button>
                </Link>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

