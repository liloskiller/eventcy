'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import BackButton from '@/components/BackButton'

const events = [
  { id: 1, name: 'Summer Beach Party', date: new Date(2025, 6, 15), location: 'Nissi Beach, Ayia Napa', club: 'Beach Club' },
  { id: 2, name: 'Foam Party Extravaganza', date: new Date(2025, 6, 22), location: 'Club Aqua, Limassol', club: 'Aqua' },
  { id: 3, name: 'Techno Night', date: new Date(2025, 7, 5), location: 'Versus Club, Nicosia', club: 'Versus' },
  { id: 4, name: 'Retro Disco Fever', date: new Date(2025, 7, 12), location: 'Time Machine, Larnaca', club: 'Time Machine' },
  { id: 5, name: 'Sunset DJ Set', date: new Date(2025, 7, 19), location: 'Guaba Beach Bar, Limassol', club: 'Guaba' },
  { id: 6, name: 'Rock Night', date: new Date(2025, 7, 26), location: 'Ravens, Paphos', club: 'Ravens' },
]

const clubs = [...new Set(events.map(event => event.club))]

export default function UpcomingEvents() {
  const [selectedClub, setSelectedClub] = useState<string | undefined>(undefined)

  const filteredEvents = selectedClub && selectedClub !== 'all'
    ? events.filter(event => event.club === selectedClub)
    : events

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6 font-sans">
      <BackButton />
      <motion.h1 
        className="text-4xl font-bold text-white text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Upcoming Events
      </motion.h1>
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Filter by Club</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClub}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clubs</SelectItem>
              {clubs.map(club => (
                <SelectItem key={club} value={club}>{club}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-4 bg-white/10 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                <p className="text-gray-200">{event.date.toDateString()}</p>
                <p className="text-gray-200">{event.location}</p>
                <p className="text-gray-200">Club: {event.club}</p>
                <Button className="mt-2 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600">
                  More Info
                </Button>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

