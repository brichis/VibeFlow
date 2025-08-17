"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const matches = [
    {
      name: "Maya Rodriguez",
      location: "Oakland",
      age: 26,
      mutualInterests: 2,
      avatar: "/images/cryptopunk.webp",
      interests: ["Photography", "Coffee", "Art Museums"],
      bio: "Love exploring new coffee shops and capturing street art around the Bay Area.",
      contact: {
        twitter: "@maya_photos",
        telegram: "@mayarodriguez",
        farcaster: "maya.eth",
      },
    },
    {
      name: "Jordan Kim",
      location: "Berkeley",
      age: 30,
      mutualInterests: 3,
      avatar: "/images/milady.webp",
      interests: ["Hiking", "Yoga", "Books"],
      bio: "Weekend warrior who loves hitting the trails and finding quiet spots to read.",
      contact: {
        twitter: "@jordanhikes",
        telegram: "@jordankim",
        farcaster: "jordan.eth",
      },
    },
    {
      name: "Sam Thompson",
      location: "SF",
      age: 24,
      mutualInterests: 3,
      avatar: "/images/bored-ape.webp",
      interests: ["Cooking", "Travel", "Photography"],
      bio: "Foodie and travel enthusiast always looking for the next adventure.",
      contact: {
        twitter: "@samcooks",
        telegram: "@samthompson",
        farcaster: "sam.eth",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/vibeflow-logo.webp"
              alt="VibeFlow Logo"
              width={150}
              height={60}
              className="h-8 w-auto"
            />
          </Link>
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 bg-transparent">
            Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Image
                src="/images/penguin-avatar.webp"
                alt="Alex Chen"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">Alex Chen</h3>
                <p className="text-gray-300">San Francisco, CA</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {["Photography", "Hiking", "Coffee", "Art Museums", "Yoga", "Cooking", "Travel", "Books"].map(
                    (interest) => (
                      <Badge key={interest} variant="secondary" className="bg-gray-700 text-white">
                        {interest}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="matching" defaultChecked />
                <label htmlFor="matching" className="text-white">
                  Enable matching
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Friendship Bracelets */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Friendship Bracelets (1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="text-white font-semibold">Sarah</p>
                <p className="text-gray-300 text-sm">2024-01-15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matches */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Matches ({matches.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <Image
                    src={match.avatar || "/placeholder.svg"}
                    alt={match.name}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-white">{match.name}</CardTitle>
                  <p className="text-gray-300 text-sm">
                    {match.location}, {match.age} • {match.mutualInterests} mutual interests
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{match.bio}</p>

                  <div>
                    <h5 className="text-white font-semibold mb-2">Shared Interests</h5>
                    <div className="flex flex-wrap gap-1">
                      {match.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="bg-gray-700 text-white text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      onClick={() => {
                        alert(
                          `Contact ${match.name}:\n\nTwitter: ${match.contact.twitter}\nTelegram: ${match.contact.telegram}\nFarcaster: ${match.contact.farcaster}`,
                        )
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 text-white hover:bg-gray-600 bg-transparent"
                    >
                      Confirm We've Met
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400 space-y-2">
          <p>&copy; 2024 VibeFlow. Find your tribe, verify your vibe.</p>
          <p className="text-4xl font-bold">Made in ETH Global New York 2025</p>
        </div>
      </footer>
    </div>
  )
}
