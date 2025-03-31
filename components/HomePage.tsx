"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Music, Ticket, Info, Star, MessageSquare, Share2, HeadphonesIcon, ChevronDown } from "lucide-react"
import ImageCarousel from "./ImageCarousel"
import DarkModeToggle from "./DarkModeToggle"

const cities = ["Nicosia", "Limassol", "Larnaca", "Paralimni", "Ayia Napa", "Paphos"]

const eventTypes = [
  {
    name: "Book Event",
    icon: Calendar,
    description: "Be there or be square! Lock in your spot at the hottest parties.",
    link: "/book-event",
  },
  {
    name: "Buy Tickets",
    icon: Ticket,
    description: "Don't miss out! Grab your tickets before they're gone.",
    link: "/buy-tickets",
  },
  {
    name: "Upcoming Events",
    icon: Music,
    description: "Stay ahead of the curve. Discover what's next in Cyprus nightlife.",
    link: "/upcoming-events",
  },
]

const clubInfo = {
  Nicosia: "Nicosia's nightlife is a hidden gem waiting to be discovered. Are you ready to explore?",
  Limassol: "Limassol's beachfront clubs are calling your name. Can you hear the beat?",
  Larnaka: "From sunset to sunrise, Larnaka's Finikoudes promenade is alive with energy. Join the party!",
  Paralimni: "Experience the local flavor of Paralimni's nightlife. It's time to mingle with the locals!",
  "Ayia Napa": "Welcome to the party capital of Cyprus! Ayia Napa's world-famous clubs are ready for you.",
  Paphos: "History by day, party by night. Paphos offers a unique blend of culture and excitement.",
}

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6 font-sans">
      <DarkModeToggle />
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Unleash the Night in Cyprus!
      </motion.h1>
      <ImageCarousel />

      <div className="mb-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
          {cities.map((city) => (
            <button
              key={city}
              className={`py-3 px-4 text-center font-medium text-base rounded-md transition-colors ${
                selectedCity === city
                  ? "bg-[#db2777] text-white"
                  : "bg-white text-purple-700 hover:bg-[#db2777] hover:text-white"
              }`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {cities.map((city) => (
        <div key={city} className={`mt-4 sm:mt-6 ${selectedCity !== city ? "hidden" : ""}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-4 sm:mb-6 bg-white backdrop-blur-md border-none text-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl">
                  <Star className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
                  {city} Nightlife Awaits!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base md:text-lg">{clubInfo["Nicosia"]}</p>
              </CardContent>
            </Card>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventTypes.map((type, index) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white backdrop-blur-md border-none text-white h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                        <type.icon className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />
                        {type.name}
                      </CardTitle>
                      <CardDescription className="text-[rgb(88_28_135)] text-sm sm:text-base font-semibold">
                        {type.name} in {city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-xs sm:text-sm md:text-base text-[rgb(88_28_135)]">{type.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={type.link} className="w-full">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base">
                          {type.name === "Upcoming Events" ? "Discover Events" : type.name}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ))}

      <motion.div
        className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
          Ready to Paint the Town?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-3 sm:mb-4 md:mb-6">
          Join thousands of party-goers and create unforgettable memories!
        </p>
        <Link href="/book-event">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md text-sm sm:text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95">
            Start Your Night Out!
          </Button>
        </Link>
      </motion.div>
      <div className="fixed bottom-4 left-4 z-50" ref={optionsRef}>
        <Button
          onClick={toggleOptions}
          className="bg-purple-600 text-white hover:bg-purple-700 font-bold py-2 px-4 rounded-md shadow-lg flex items-center text-xs sm:text-sm"
        >
          <Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Options
          <ChevronDown
            className={`ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isOptionsOpen ? "rotate-180" : ""}`}
          />
        </Button>
        <AnimatePresence>
          {isOptionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl"
            >
              <div className="py-2">
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left text-xs sm:text-sm">
                  <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Feedback
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left text-xs sm:text-sm">
                  <Share2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Socials
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left text-xs sm:text-sm">
                  <HeadphonesIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Customer Support
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

