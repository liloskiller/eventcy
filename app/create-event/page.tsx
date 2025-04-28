'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function CreateEventPage() {
  const { user } = useAuth()
  const router = useRouter()
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

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxTickets: parseInt(formData.maxTickets),
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create event')
      }

      router.push('/buy-tickets')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        if (err.message.includes('authenticated')) {
          router.push('/login')
        }
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading authentication...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-center text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <Input
              type="date"
              placeholder="Event Date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Price (€)"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <Input
              type="number"
              placeholder="Max Tickets"
              value={formData.maxTickets}
              onChange={(e) => handleChange('maxTickets', e.target.value)}
              min="1"
              required
            />
            <div className="flex items-center space-x-4">
              <span>Seating Enabled</span>
              <Switch
                checked={formData.seatingEnabled}
                onCheckedChange={(checked) => handleChange('seatingEnabled', checked)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Publish Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
