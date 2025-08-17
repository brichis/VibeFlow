import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const ttFirsNeue = localFont({
  src: [
    {
      path: "https://fonts.googleapis.com/css2?family=TT+Firs+Neue:wght@300;400;500;600;700;800;900&display=swap",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-tt-firs-neue",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: "VibeFlow - Find Your Tribe, Verify Your Vibe",
  description: "Social network for event-based connections",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${ttFirsNeue.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
