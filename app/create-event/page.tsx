'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import DarkModeToggle from '@/components/DarkModeToggle'
import BackButton from '@/components/BackButton'

export default function CreateEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [maxTickets, setMaxTickets] = useState('')
  const [seatingEnabled, setSeatingEnabled] = useState(false)

  const handleSubmit = async () => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        date,
        location,
        price: parseFloat(price),
        maxTickets: parseInt(maxTickets),
        seatingEnabled,
      }),
    })

    if (res.ok) {
      router.push('/buy-tickets')
    } else {
      alert('Failed to create event.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6 font-sans">
      <DarkModeToggle />
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="date" placeholder="Event Date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input type="number" placeholder="Price (€)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input type="number" placeholder="Max Tickets" value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} />
            <div className="flex items-center space-x-4">
              <span>Seating Enabled</span>
              <Switch checked={seatingEnabled} onCheckedChange={setSeatingEnabled} />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600"
            >
              Publish Event
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
