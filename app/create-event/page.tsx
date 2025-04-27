// app/create-event/page.tsx
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Not authenticated')
      }
  
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxTickets: parseInt(formData.maxTickets),
        }),
      })
  
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create event')
      }
  
      router.push('/buy-tickets')
    } catch (err) {
      // Proper error type checking
      if (err instanceof Error) {
        setError(err.message)
        if (err.message.includes('authenticated') || err.message.includes('token')) {
          router.push('/login')
        }
      } else if (typeof err === 'string') {
        setError(err)
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
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              type="date"
              name="date"
              placeholder="Event Date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
            <Input
              type="number"
              name="price"
              placeholder="Price (€)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              min="0"
              step="0.01"
              required
            />
            <Input
              type="number"
              name="maxTickets"
              placeholder="Max Tickets"
              value={formData.maxTickets}
              onChange={(e) => setFormData({...formData, maxTickets: e.target.value})}
              min="1"
              required
            />
            <div className="flex items-center space-x-4">
              <span>Seating Enabled</span>
              <Switch
                checked={formData.seatingEnabled}
                onCheckedChange={(checked) =>
                  setFormData({...formData, seatingEnabled: checked})
                }
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