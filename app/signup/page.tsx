"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AxiosError } from 'axios';
import BackButton from "@/components/BackButton"
import axios from "axios"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions to sign up.")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post("YOUR_BACKEND_URL/signup", {
        username: name,
        email,
        password,
      })
      
      alert("Sign-up successful! Redirecting to home page...")
      router.push("/home")
    } catch (error: any) {
      const axiosError = error as AxiosError;
      console.error("Sign-up error:", error);
      const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred.";
      alert("Error signing up: " + errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center text-purple-700">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={() => setAgreeTerms(!agreeTerms)} />
                <label htmlFor="terms">I agree to the <Link href="/terms" className="text-purple-600 hover:text-purple-800 font-semibold">Terms and Conditions</Link></label>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-800 font-semibold">Login</Link></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

