"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ImageCarouselProps {
  images?: { src: string; alt: string }[]
}

const defaultImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xHOmqY4HY5javjDNq9pWVzgqrYOOC1.png",
    alt: "Exciting beach party with water spray and palm trees",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2j.jpg-AM13nq8YWdULgfo08qhWm82Pn3IcQO.jpeg",
    alt: "DJ performing at Castle Club",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nightclub.jpg-epfGX8pCsedRFjhOAjmiOkO6lhnJVy.jpeg",
    alt: "Vibrant nightclub scene with confetti and lights",
  },
]

export default function ImageCarousel({ images = defaultImages }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-lg mb-8">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
            index === currentIndex ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}

