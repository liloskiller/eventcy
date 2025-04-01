"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import BackButton from "@/components/BackButton"

interface User {
  name: string
  surname: string
  email: string
  phone: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4 sm:p-6 font-sans">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-10"
      >
        <Card className="bg-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    value={user.surname}
                    onChange={(e) => setUser({ ...user, surname: e.target.value })}
                    disabled={!isEditing}
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-50"
                />
              </div>
              {isEditing ? (
                <div className="flex justify-end space-x-2">
                  <Button type="submit" className="bg-green-500 hover:bg-green-600">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  Edit Profile
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}