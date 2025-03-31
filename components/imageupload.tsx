'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  currentImage?: string
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    onImageUpload(file)
    setPreview(URL.createObjectURL(file))
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative w-full h-40">
          <Image src={preview || "/placeholder.svg"} alt="Uploaded image" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
      ) : (
        <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
      )}
    </div>
  )
}

