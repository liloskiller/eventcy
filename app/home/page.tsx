import type { Metadata } from "next"
import HomePage from "@/components/homepage"

export const metadata: Metadata = {
  title: "Event Booking Platform",
  description: "Book, buy tickets, and make reservations for upcoming events and parties in Cyprus.",
}

export default function Home() {
  return <HomePage />
}

