"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Leaf, Car, Users, Award, MapPin, Star, Plus, Search, TrendingUp, Zap, Lock, Droplet } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Achievement {
  title: string
  description: string
  unlocked: boolean
  progress: number
}

interface DashboardData {
  user: {
    name: string
    email: string
    vehicleType: string | null
    vehicleModel: string | null
    memberSince: string
  }
  stats: {
    ridesCompleted: number
    co2Saved: string
    ecoPoints: number
    rating: string
  }
  environmentalImpact: {
    treesEquivalent: string
    gasSaved: string
    totalDistance: string
    achievements: Achievement[]
    tips: string[]
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Rotate environmental tips every 10 seconds
    const tipInterval = setInterval(() => {
      if (dashboardData?.environmentalImpact.tips) {
        setCurrentTipIndex((prev) => 
          (prev + 1) % dashboardData.environmentalImpact.tips.length
        )
      }
    }, 10000)

    return () => clearInterval(tipInterval)
  }, [status, router, dashboardData?.environmentalImpact.tips])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your environmental impact...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { user, stats, environmentalImpact } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              EcoRide
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-green-600 font-medium">
              Dashboard
            </Link>
            <Link href="/rides" className="text-gray-600 hover:text-green-600 transition-colors">
              Find Rides
            </Link>
            <Link href="/publish" className="text-gray-600 hover:text-green-600 transition-colors">
              Publish Ride
            </Link>
            <Link href="/rewards" className="text-gray-600 hover:text-green-600 transition-colors">
              Rewards
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section with Environmental Tip */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}! 🌱</h1>
          <div className="bg-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">
              <Leaf className="inline-block w-5 h-5 mr-2 mb-1" />
              {environmentalImpact.tips[currentTipIndex]}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/publish">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Publish a Ride</h3>
                  <p className="text-gray-600">Share your eco-friendly journey</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rides">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find a Ride</h3>
                  <p className="text-gray-600">Join an eco-friendly journey</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Environmental Impact Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Environmental Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.co2Saved} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Equivalent to {environmentalImpact.treesEquivalent} trees planted
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fuel Saved</p>
                    <p className="text-2xl font-bold text-blue-600">{environmentalImpact.gasSaved}L</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Distance shared: {environmentalImpact.totalDistance} km
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">EcoPoints</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.ecoPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Keep earning to unlock rewards!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Environmental Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {environmentalImpact.achievements.map((achievement, index) => (
              <Card key={index} className={`border-0 shadow-lg ${achievement.unlocked ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gray-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        {!achievement.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <Progress value={achievement.progress} className="h-2 mb-2" />
                  <p className="text-xs text-gray-500 text-right">{achievement.progress}% Complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rides Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.ridesCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge className="bg-purple-100 text-purple-700">Keep riding!</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.rating}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= parseFloat(stats.rating)
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
