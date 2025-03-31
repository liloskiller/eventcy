'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link';
import BackButton from '@/components/backbutton'

const tickets = [
  { id: 1, name: 'Summer Beach Party', date: new Date(2023, 6, 15), price: 25, location: 'Nissi Beach, Ayia Napa' },
  { id: 2, name: 'Foam Party Extravaganza', date: new Date(2023, 6, 22), price: 30, location: 'Club Aqua, Limassol' },
  { id: 3, name: 'Techno Night', date: new Date(2023, 7, 5), price: 20, location: 'Versus Club, Nicosia' },
  { id: 4, name: 'Retro Disco Fever', date: new Date(2023, 7, 12), price: 15, location: 'Time Machine, Larnaca' },
  { id: 5, name: 'Sunset DJ Set', date: new Date(2023, 7, 19), price: 35, location: 'Guaba Beach Bar, Limassol' },
  { id: 6, name: 'Rock Night', date: new Date(2023, 7, 26), price: 18, location: 'Ravens, Paphos' },
]

export default function BuyTickets() {
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
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{ticket.name}</h3>
                <p className="text-gray-600 dark:text-gray-200">{ticket.date.toDateString()}</p>
                <p className="text-gray-600 dark:text-gray-200">{ticket.location}</p>
                <p className="text-gray-800 dark:text-gray-200 font-bold">Price: €{ticket.price}</p>
                <Link href={`/buy-tickets/${ticket.id}`}>
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

