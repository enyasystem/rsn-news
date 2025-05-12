"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  fallbackSrc: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  onLoad?: () => void
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className = "",
  priority = false,
  onLoad,
  objectFit = "cover",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Reset error state if src changes
  useEffect(() => {
    setError(false)
    setCurrentSrc(src)
  }, [src])

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <div className="h-8 w-8 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
        </div>
      )}

      {error ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center justify-center p-4">
            <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
            <Image
              src={fallbackSrc || "/placeholder.svg"}
              alt={alt}
              width={width / 2}
              height={height / 2}
              className="object-contain max-h-16"
              onLoad={() => {
                setLoaded(true)
                onLoad?.()
              }}
              {...props}
            />
          </div>
        </div>
      ) : (
        <Image
          src={currentSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`object-${objectFit} h-full w-full`}
          priority={priority}
          onLoad={() => {
            setLoaded(true)
            onLoad?.()
          }}
          onError={() => {
            if (currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc)
            } else {
              setError(true)
            }
          }}
          {...props}
        />
      )}
    </div>
  )
}
