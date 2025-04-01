import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EventCy",
  description: "Book events and parties in Cyprus",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>{children}</body>
    </html>
    </AuthProvider>
  );
}



import './globals.css'