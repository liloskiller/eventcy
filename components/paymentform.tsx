"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically process the payment
    onSuccess()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 rounded-lg flex items-center justify-center ${
              paymentMethod === "card" ? "bg-purple-100 dark:bg-purple-900" : "bg-gray-100 dark:bg-gray-700"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            <span>Card</span>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg flex items-center justify-center ${
              paymentMethod === "cash" ? "bg-purple-100 dark:bg-purple-900" : "bg-gray-100 dark:bg-gray-700"
            }`}
            onClick={() => setPaymentMethod("cash")}
          >
            <Wallet className="mr-2 h-5 w-5" />
            <span>Cash</span>
          </button>
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pay €{amount}</p>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
        </div>

        {paymentMethod === "card" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Card Number</label>
              <input
                className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Expiry Date</label>
                <input
                  className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">CVV</label>
                <input
                  className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition"
                  type="number"
                  placeholder="000"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-600 dark:text-gray-300 py-4">Pay in cash at the entrance</div>
        )}

        <button
          className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          type="submit"
        >
          {paymentMethod === "card" ? "Pay Now" : "Confirm Payment at Entrance"}
        </button>
      </form>
    </motion.div>
  )
}

