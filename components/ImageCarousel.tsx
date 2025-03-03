'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images?: { src: string; alt: string }[];
}

const defaultImages = [
  { src: '/club1.jpg', alt: 'Exciting nightclub scene' },
  { src: '/concert.jpg', alt: 'Live concert performance' },
  { src: '/beach-party.jpg', alt: 'Beach party in Ayia Napa' },
  { src: '/dj.jpg', alt: 'DJ performing at a club' },
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
    <div className="relative w-full h-64 overflow-hidden rounded-lg mb-8">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
            index === currentIndex ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}

