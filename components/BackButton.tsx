'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 flex items-center gap-2 transition-colors duration-300"
      whileHover={{ scale: 1.05, x: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="pr-1">Back</span>
    </motion.button>
  )
}

export  function BackToMain() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.push("/home")}
      className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 flex items-center gap-2 transition-colors duration-300"
      whileHover={{ scale: 1.05, x: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="pr-1">Back!</span>
    </motion.button>
  )
}