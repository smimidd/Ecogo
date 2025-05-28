"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Award, Star, Gift, Zap, Users, Car, Trophy, Target, Coffee, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function RewardsPage() {
  const userStats = {
    ecoPoints: 2450,
    level: "Eco Warrior",
    nextLevel: "Green Champion",
    pointsToNext: 550,
    co2Saved: 156.8,
    ridesCompleted: 47,
    rating: 4.9,
  }

  const achievements = [
    {
      id: 1,
      title: "First Ride",
      description: "Complete your first eco-ride",
      icon: Car,
      earned: true,
      points: 50,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Complete 50 rides",
      icon: Leaf,
      earned: true,
      points: 500,
      date: "2024-03-10",
    },
    {
      id: 3,
      title: "Electric Pioneer",
      description: "Take 25 rides in electric vehicles",
      icon: Zap,
      earned: true,
      points: 300,
      date: "2024-02-28",
    },
    {
      id: 4,
      title: "Community Builder",
      description: "Maintain 4.8+ star rating",
      icon: Users,
      earned: true,
      points: 200,
      date: "2024-03-05",
    },
    {
      id: 5,
      title: "Green Champion",
      description: "Save 200kg of CO₂",
      icon: Trophy,
      earned: false,
      points: 1000,
      progress: 78,
    },
    {
      id: 6,
      title: "Perfect Month",
      description: "Complete 20 rides in one month",
      icon: Target,
      earned: false,
      points: 750,
      progress: 60,
    },
  ]

  const rewards = [
    {
      id: 1,
      title: "Free Coffee",
      description: "Redeem at partner cafes",
      points: 100,
      category: "Food & Drink",
      icon: Coffee,
      available: true,
    },
    {
      id: 2,
      title: "$5 Ride Credit",
      description: "Apply to your next ride",
      points: 250,
      category: "Transportation",
      icon: Car,
      available: true,
    },
    {
      id: 3,
      title: "EV Charging Credit",
      description: "$10 charging station credit",
      points: 500,
      category: "Transportation",
      icon: Zap,
      available: true,
    },
    {
      id: 4,
      title: "Eco Store Discount",
      description: "20% off sustainable products",
      points: 300,
      category: "Shopping",
      icon: ShoppingBag,
      available: true,
    },
    {
      id: 5,
      title: "$20 Ride Credit",
      description: "Apply to your next ride",
      points: 1000,
      category: "Transportation",
      icon: Car,
      available: false,
    },
    {
      id: 6,
      title: "Premium Membership",
      description: "1 month premium features",
      points: 2000,
      category: "Premium",
      icon: Star,
      available: false,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Food & Drink":
        return "bg-orange-100 text-orange-700"
      case "Transportation":
        return "bg-blue-100 text-blue-700"
      case "Shopping":
        return "bg-purple-100 text-purple-700"
      case "Premium":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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
            <Link href="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/rides" className="text-gray-600 hover:text-green-600 transition-colors">
              Find Rides
            </Link>
            <Link href="/publish" className="text-gray-600 hover:text-green-600 transition-colors">
              Publish Ride
            </Link>
            <Link href="/rewards" className="text-green-600 font-medium">
              Rewards
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">EcoRewards Center</h1>
          <p className="text-gray-600">Earn points for sustainable choices and redeem amazing rewards</p>
        </div>

        {/* Points Overview */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{userStats.ecoPoints.toLocaleString()}</div>
                <div className="text-green-100">EcoPoints</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{userStats.level}</div>
                <div className="text-green-100">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{userStats.co2Saved} kg</div>
                <div className="text-green-100">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{userStats.ridesCompleted}</div>
                <div className="text-green-100">Rides Completed</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-100">Progress to {userStats.nextLevel}</span>
                <span className="text-green-100">{userStats.pointsToNext} points to go</span>
              </div>
              <Progress value={82} className="h-3 bg-green-400" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className={`border-0 shadow-lg ${!reward.available ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <reward.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <Badge className={getCategoryColor(reward.category)}>{reward.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">{reward.points} points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!reward.available || userStats.ecoPoints < reward.points}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        {reward.available && userStats.ecoPoints >= reward.points ? "Redeem" : "Not Available"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`border-0 shadow-lg ${achievement.earned ? "bg-green-50 border-green-200" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${achievement.earned ? "text-white" : "text-gray-400"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge className="bg-green-100 text-green-700">
                              <Award className="w-3 h-3 mr-1" />
                              Earned
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Gift className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-600 font-medium">+{achievement.points} points</span>
                          </div>
                          {achievement.earned && (
                            <span className="text-sm text-gray-500">Earned on {achievement.date}</span>
                          )}
                        </div>
                        {!achievement.earned && achievement.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm text-gray-600">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Earn Points */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              How to Earn EcoPoints
            </CardTitle>
            <CardDescription>Different ways to earn points and contribute to the environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Car className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Complete Rides</h4>
                <p className="text-sm text-gray-600">+50 points per ride</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Electric Vehicles</h4>
                <p className="text-sm text-gray-600">+25 bonus points</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">High Ratings</h4>
                <p className="text-sm text-gray-600">+10 points per 5-star</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Refer Friends</h4>
                <p className="text-sm text-gray-600">+100 points per referral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
