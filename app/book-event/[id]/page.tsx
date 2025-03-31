'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DarkModeToggle from '@/components/DarkModeToggle'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import PaymentForm from '@/components/PaymentForm'
import BackButton from '@/components/BackButton'

interface Event {
  id: number
  name: string
  date: Date
  location: string
  club: string
  description: string
  aesthetics: string
  crowd: string
  image: string
  price: number
}

const events: Event[] = [
  {
    id: 1,
    name: 'Summer Beach Party',
    date: new Date(2023, 6, 15),
    location: 'Nissi Beach, Ayia Napa',
    club: 'Beach Club Nissi',
    description: 'Experience the ultimate beach party with world-class DJs and endless summer vibes.',
    aesthetics: 'Tropical paradise with palm trees, white sand, and crystal-clear waters.',
    crowd: 'Young, energetic party-goers looking for a fun-filled beach experience.',
    image: '/beach-club.jpg',
    price: 30
  },
  {
    id: 2,
    name: 'Foam Party Extravaganza',
    date: new Date(2023, 6, 22),
    location: 'Club Aqua, Limassol',
    club: 'Club Aqua',
    description: 'Get ready for a night of foam-filled fun with amazing music and unforgettable memories.',
    aesthetics: 'Modern club with state-of-the-art lighting and sound systems, featuring multiple foam cannons.',
    crowd: 'Diverse mix of locals and tourists looking for a unique party experience.',
    image: '/foam-party.jpg',
    price: 25
  },
  // Add more events as needed
]

export default function EventBookingPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const eventId = parseInt(params.id)
    const foundEvent = events.find(e => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
    } else {
      router.push('/book-event')
    }
  }, [params.id, router])

  const handlePaymentSuccess = () => {
    setShowQRCode(true)
    setShowPaymentForm(false)
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6 font-sans">
      <DarkModeToggle />
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">{event.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative h-48 sm:h-64 w-full">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.club}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-base sm:text-lg"><strong>Date:</strong> {event.date.toDateString()}</p>
              <p className="text-base sm:text-lg"><strong>Location:</strong> {event.location}</p>
              <p className="text-base sm:text-lg"><strong>Club:</strong> {event.club}</p>
              <p className="text-base sm:text-lg">{event.description}</p>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Club Aesthetics</h3>
                <p className="text-sm sm:text-base">{event.aesthetics}</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Crowd</h3>
                <p className="text-sm sm:text-base">{event.crowd}</p>
              </div>
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl font-bold">Price: â‚¬{event.price}</p>
                
                {!showPaymentForm && !showQRCode && (
                  <motion.button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                  </motion.button>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {showPaymentForm && (
                  <PaymentForm amount={event.price} onSuccess={handlePaymentSuccess} />
                )}
                {showQRCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold">Your Booking QR Code</h3>
                    <QRCodeGenerator data={`Event: ${event.name}, Date: ${event.date.toDateString()}, Price: â‚¬${event.price}`} />
                    <p className="text-sm">Please show this QR code at the entrance. You can also find this in your email.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

