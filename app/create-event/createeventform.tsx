// app/create-event/CreateEventForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import DarkModeToggle from '@/components/DarkModeToggle'
import BackButton from '@/components/BackButton'

export default function CreateEventForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    price: '',
    maxTickets: '',
    seatingEnabled: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/create-event')
    } else if (status === 'authenticated' && session?.user?.role !== 'STAFF') {
      router.push('/?error=unauthorized')
    }
  }, [status, session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create event')
      }

      router.push('/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status !== 'authenticated' || session?.user?.role !== 'STAFF') {
    return <div>Checking permissions...</div>
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
            <CardTitle className="text-2xl font-bold text-center">
              Create New Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="date"
                name="date"
                placeholder="Event Date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <Input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="price"
                placeholder="Price (€)"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
              <Input
                type="number"
                name="maxTickets"
                placeholder="Max Tickets"
                value={formData.maxTickets}
                onChange={handleChange}
                min="1"
                required
              />
              <div className="flex items-center space-x-4">
                <span>Seating Enabled</span>
                <Switch
                  name="seatingEnabled"
                  checked={formData.seatingEnabled}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, seatingEnabled: checked }))
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600"
              >
                {loading ? 'Creating...' : 'Publish Event'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}