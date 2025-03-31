'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  data: string
}

export default function QRCodeGenerator({ data }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, { width: 200 }, (error) => {
        if (error) console.error('Error generating QR code:', error)
      })
    }
  }, [data])

  return <canvas ref={canvasRef} />
}

