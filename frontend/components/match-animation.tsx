"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function MatchAnimation() {
  const [isMatched, setIsMatched] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsMatched(true)
    }, 1000)

    const timer2 = setTimeout(() => {
      setShowText(true)
    }, 2000)

    const timer3 = setTimeout(() => {
      setIsMatched(false)
      setShowText(false)
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Restart animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsMatched(false)
      setShowText(false)

      setTimeout(() => setIsMatched(true), 1000)
      setTimeout(() => setShowText(true), 2000)
      setTimeout(() => {
        setIsMatched(false)
        setShowText(false)
      }, 4000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 animate-pulse" />

      {/* Left NFT Avatar */}
      <div
        className={`absolute transition-all duration-1000 ease-out ${
          isMatched ? "left-1/2 -translate-x-20" : "left-8"
        }`}
      >
        <div className="relative">
          <Image
            src="/images/cryptopunk.webp"
            alt="CryptoPunk Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-pink-500 shadow-lg shadow-pink-500/50 object-cover w-[120px] h-[120px]"
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Right NFT Avatar */}
      <div
        className={`absolute transition-all duration-1000 ease-out ${
          isMatched ? "right-1/2 -translate-x-[-20px]" : "right-8"
        }`}
      >
        <div className="relative">
          <Image
            src="/images/milady.webp"
            alt="Milady Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-cyan-500 shadow-lg shadow-cyan-500/50 object-cover w-[120px] h-[120px]"
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Rainbow explosion effect */}
      {isMatched && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🌈</div>
          <div className="absolute text-4xl animate-ping">🌈</div>
        </div>
      )}

      {/* "It's a Match!" text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl md:text-6xl font-bold holographic-text animate-bounce">It's a Match!</div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-float opacity-60`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
