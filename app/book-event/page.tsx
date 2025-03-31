"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import DarkModeToggle from "@/components/DarkModeToggle"
import BackButton from "@/components/BackButton"
import UserInfoForm from "@/components/UserInfoForm"

const events = [
  {
    id: 1,
    name: "Summer Beach Party",
    date: new Date(2023, 6, 15),
    location: "Nissi Beach, Ayia Napa",
    images: ["/beach-party1.jpg", "/beach-party2.jpg", "/beach-party3.jpg"],
  },
  {
    id: 2,
    name: "Foam Party Extravaganza",
    date: new Date(2023, 6, 22),
    location: "Club Aqua, Limassol",
    images: ["/foam-party1.jpg", "/foam-party2.jpg", "/foam-party3.jpg"],
  },
  {
    id: 3,
    name: "Techno Night",
    date: new Date(2023, 7, 5),
    location: "Versus Club, Nicosia",
    images: ["/techno-night1.jpg", "/techno-night2.jpg", "/techno-night3.jpg"],
  },
  {
    id: 4,
    name: "Retro Disco Fever",
    date: new Date(2023, 7, 12),
    location: "Time Machine, Larnaca",
    images: ["/retro-disco1.jpg", "/retro-disco2.jpg", "/retro-disco3.jpg"],
  },
  {
    id: 5,
    name: "Sunset DJ Set",
    date: new Date(2023, 7, 19),
    location: "Guaba Beach Bar, Limassol",
    images: ["/sunset-dj1.jpg", "/sunset-dj2.jpg", "/sunset-dj3.jpg"],
  },
  {
    id: 6,
    name: "Rock Night",
    date: new Date(2023, 7, 26),
    location: "Ravens, Paphos",
    images: ["/rock-night1.jpg", "/rock-night2.jpg", "/rock-night3.jpg"],
  },
]

export default function BookEvent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const [showUserInfoForm, setShowUserInfoForm] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevState) => {
        const newState = { ...prevState }
        events.forEach((event) => {
          newState[event.id] = (newState[event.id] + 1) % event.images.length || 0
        })
        return newState
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setFilteredEvents(events.filter((event) => event.date.toDateString() === date.toDateString()))
    } else {
      setFilteredEvents(events)
    }
  }

  const handleBookNow = () => {
    if (!user) {
      setShowUserInfoForm(true)
    } else {
      // Proceed with booking
      console.log("Booking with user:", user)
    }
  }

  const handleUserInfoSubmit = (data: any) => {
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
    setShowUserInfoForm(false)
    // Proceed with booking
    console.log("Booking with new user:", data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6 font-sans">
      <BackButton />
      <DarkModeToggle />
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-white text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Book Your Next Event
      </motion.h1>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <Card className="w-full lg:w-1/3 dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border dark:bg-gray-700 dark:text-white mx-auto"
            />
          </CardContent>
        </Card>
        <Card className="w-full lg:w-2/3 dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle>Available Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] sm:h-[600px]">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-1/3 h-48">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImageIndex[event.id]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={event.images[currentImageIndex[event.id]] || "/placeholder.svg"}
                            alt={event.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="sm:w-2/3">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {event.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {event.date.toDateString()}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{event.location}</p>
                      <Button
                        className="mt-4 w-full sm:w-auto bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white"
                        onClick={handleBookNow}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {showUserInfoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        </div>
      )}
    </div>
  )
}

