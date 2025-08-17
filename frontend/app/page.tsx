import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import MatchAnimation from "@/components/match-animation"

export default function VibeFlowLanding() {
  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white relative overflow-hidden font-tt-firs-neue">
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/images/holographic-u.png"
          alt=""
          width={200}
          height={200}
          className="absolute top-20 right-10 animate-float opacity-30"
        />
        <Image
          src="/images/holographic-curve.png"
          alt=""
          width={150}
          height={150}
          className="absolute top-1/2 left-10 animate-pulse-glow opacity-40"
        />
        <Image
          src="/images/gradient-blob.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-20 right-20 animate-rotate-slow opacity-20"
        />
        <Image
          src="/images/holographic-dome.png"
          alt=""
          width={180}
          height={180}
          className="absolute bottom-40 left-20 animate-float opacity-35"
        />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <header className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/vibeflow-logo.webp"
                alt="VibeFlow Logo"
                width={900}
                height={360}
                className="h-54 w-auto"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold holographic-text">Find your tribe, verify your vibe</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">Social network for event-based connections</p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 relative z-20">
                Create Your Account
              </Button>
            </div>
          </div>
        </header>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-white">Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Sign up and add contact details (Twitter, Farcaster, Telegram)</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-white">Verify Your Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Connect Eventbrite account to show real events attended</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-white">Find Your Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Turn on matching to discover people with shared interests</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <CardTitle className="text-white">Make Real Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Meet in person and create digital friendship bracelets</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to find your matches?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how VibeFlow connects you with people who share your interests
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg px-8 py-3"
              >
                View Dashboard Demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <MatchAnimation />
        </section>

        <footer className="container mx-auto px-4 py-8 border-t border-gray-700">
          <div className="text-center text-gray-400 space-y-2">
            <p>&copy; 2024 VibeFlow. Find your tribe, verify your vibe.</p>
            <p className="text-sm">Made in ETH Global New York 2025</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
