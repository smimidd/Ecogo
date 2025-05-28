"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, MapPin, Calendar, Clock, Star, Users, Car, Zap, Filter, Search } from "lucide-react"
import Link from "next/link"
import { CitySearch } from "@/components/ui/city-search"

export default function RidesPage() {
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const availableRides = [
    {
      id: 1,
      driver: {
        name: "Sarah Chen",
        rating: 4.9,
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      from: "San Francisco",
      to: "San Jose",
      date: "Today",
      time: "2:30 PM",
      duration: "1h 15m",
      price: "$15",
      vehicle: {
        type: "electric",
        model: "Tesla Model 3",
        year: "2023",
      },
      availableSeats: 3,
      co2Impact: "12.5 kg saved",
      amenities: ["WiFi", "Phone Charger", "AC"],
      pickupPoints: ["Downtown SF", "SOMA District"],
    },
    {
      id: 2,
      driver: {
        name: "Mike Johnson",
        rating: 4.8,
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      from: "Oakland",
      to: "Berkeley",
      date: "Tomorrow",
      time: "8:00 AM",
      duration: "45m",
      price: "$8",
      vehicle: {
        type: "hybrid",
        model: "Toyota Prius Prime",
        year: "2022",
      },
      availableSeats: 2,
      co2Impact: "8.2 kg saved",
      amenities: ["Phone Charger", "AC"],
      pickupPoints: ["Oakland BART", "Lake Merritt"],
    },
    {
      id: 3,
      driver: {
        name: "Emma Rodriguez",
        rating: 5.0,
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      from: "Palo Alto",
      to: "Mountain View",
      date: "Tomorrow",
      time: "6:45 PM",
      duration: "25m",
      price: "$6",
      vehicle: {
        type: "electric",
        model: "Nissan Leaf",
        year: "2023",
      },
      availableSeats: 1,
      co2Impact: "5.8 kg saved",
      amenities: ["WiFi", "Phone Charger"],
      pickupPoints: ["Stanford Campus", "Palo Alto Caltrain"],
    },
  ]

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "electric":
        return <Zap className="w-4 h-4 text-blue-600" />
      case "hybrid":
        return <Leaf className="w-4 h-4 text-green-600" />
      default:
        return <Car className="w-4 h-4 text-gray-600" />
    }
  }

  const getVehicleColor = (type: string) => {
    switch (type) {
      case "electric":
        return "bg-blue-100 text-blue-700"
      case "hybrid":
        return "bg-green-100 text-green-700"
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
            <Link href="/rides" className="text-green-600 font-medium">
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
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Find Your Perfect Eco-Ride
            </CardTitle>
            <CardDescription>Search for available rides in hybrid and electric vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <CitySearch
                  value={searchFrom}
                  onChange={setSearchFrom}
                  placeholder="Departure city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <CitySearch
                  value={searchTo}
                  onChange={setSearchTo}
                  placeholder="Destination city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search Rides
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="electric">Electric Only</SelectItem>
              <SelectItem value="hybrid">Hybrid Only</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="low">Under $10</SelectItem>
              <SelectItem value="medium">$10 - $20</SelectItem>
              <SelectItem value="high">Over $20</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.8">4.8+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Rides ({availableRides.length})</h2>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Departure Time</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="eco">Most Eco-Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ride Cards */}
        <div className="space-y-6">
          {availableRides.map((ride) => (
            <Card key={ride.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Driver Info */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={ride.driver.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {ride.driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{ride.driver.name}</h3>
                        {ride.driver.verified && <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{ride.driver.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Time */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {ride.from} → {ride.to}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{ride.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Duration: {ride.duration}</p>
                  </div>

                  {/* Vehicle & Environmental Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {getVehicleIcon(ride.vehicle.type)}
                      <span className="font-medium">{ride.vehicle.model}</span>
                      <Badge className={getVehicleColor(ride.vehicle.type)}>{ride.vehicle.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{ride.co2Impact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{ride.availableSeats} seats available</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-green-600">{ride.price}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      Book Ride
                    </Button>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Pickup Points:</p>
                      <div className="flex flex-wrap gap-2">
                        {ride.pickupPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {ride.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Rides
          </Button>
        </div>
      </div>
    </div>
  )
}
