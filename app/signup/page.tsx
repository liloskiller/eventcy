"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import BackButton from "@/components/BackButton"




export default function SignUpPage() {
  const { login } = useAuth();
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password_hash, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const router = useRouter()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("")
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions to sign up.");
      return;
    }
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password_hash }),
      });
  
      const data = await response.json();
      if (!agreeTerms) {
      setError(data.error || "Login failed")
      return;
      }

      if (response.ok) {
        if (data.token) {
          login(data.token);
          router.push("/home");
        } else {
          console.error("No token received.");
          setError(data.error || "Error signing up...")
        }
        
      } else {
        console.error("Sign-up failed:", data.error);
        setError(data.error || "Sign-up failed")
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setError("Error during sign-up")
    }
  };
  
  

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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password_hash}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreeTerms} onCheckedChange={() => setAgreeTerms(!agreeTerms)} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the{" "}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-800 font-semibold">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>

              <div className="h-5 text-center text-sm text-red-500">
              {error && 'Error during sign-up'}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign Up
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

