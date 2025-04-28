'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import BackToMain from "@/components/BackButton"

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
      <div className="flex justify-center items-center h-screen bg-indigo-50">
        <p className="text-gray-800">Loading authentication...</p>
      </div>
    )
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4 sm:p-6 font-sans">
      <BackToMain />
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Create New Event
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 text-gray-800"
                required
              />
            </div>

            <div>
              <Input
                type="date"
                name="date"
                placeholder="Event Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 text-gray-800"
                required
              />
            </div>

            <div>
              <Input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 text-gray-800"
                required
              />
            </div>

            <div>
              <Input
                type="number"
                name="price"
                placeholder="Price (€)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 text-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Input
                type="number"
                name="maxTickets"
                placeholder="Max Tickets"
                value={formData.maxTickets}
                onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
                className="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 text-gray-800"
                min="1"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">Seating Enabled</span>
              <Switch
                checked={formData.seatingEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, seatingEnabled: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
            >
              {loading ? 'Creating...' : 'Publish Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
