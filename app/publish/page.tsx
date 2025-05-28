"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, MapPin, Calendar, Car, Users, DollarSign, Zap, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { CitySearch } from "@/components/ui/city-search"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface FormData {
  fromCity: string
  toCity: string
  fromAddress: string
  toAddress: string
  departureDate: string
  departureTime: string
  returnTrip: boolean
  returnDate?: string
  returnTime?: string
  availableSeats: number
  price: number
  description: string
  amenities: string[]
  pickupPoints: Array<{
    name: string
    address: string
  }>
}

interface FormErrors {
  fromCity?: string
  toCity?: string
  fromAddress?: string
  toAddress?: string
  departureDate?: string
  departureTime?: string
  returnDate?: string
  returnTime?: string
  availableSeats?: string
  price?: string
}

export default function PublishRidePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fromCity: "",
    toCity: "",
    fromAddress: "",
    toAddress: "",
    departureDate: "",
    departureTime: "",
    returnTrip: false,
    availableSeats: 3,
    price: 0,
    description: "",
    amenities: [],
    pickupPoints: []
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: FormErrors = {}
    if (!formData.fromCity) newErrors.fromCity = "Departure city is required"
    if (!formData.toCity) newErrors.toCity = "Destination city is required"
    if (!formData.fromAddress) newErrors.fromAddress = "Pickup address is required"
    if (!formData.toAddress) newErrors.toAddress = "Drop-off address is required"
    if (!formData.departureDate) newErrors.departureDate = "Departure date is required"
    if (!formData.departureTime) newErrors.departureTime = "Departure time is required"
    if (formData.returnTrip) {
      if (!formData.returnDate) newErrors.returnDate = "Return date is required"
      if (!formData.returnTime) newErrors.returnTime = "Return time is required"
    }
    if (formData.availableSeats < 1) newErrors.availableSeats = "At least one seat must be available"
    if (formData.price < 0) newErrors.price = "Price cannot be negative"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          departureTime: `${formData.departureDate}T${formData.departureTime}`,
          returnTime: formData.returnTrip ? `${formData.returnDate}T${formData.returnTime}` : undefined
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ride")
      }

      const data = await response.json()
      router.push(`/rides/${data.id}`)
    } catch (error) {
      console.error("Error creating ride:", error)
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
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
            <Link href="/publish" className="text-green-600 font-medium">
              Publish Ride
            </Link>
            <Link href="/rewards" className="text-gray-600 hover:text-green-600 transition-colors">
              Rewards
            </Link>
          </nav>
        </div>
      </header>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Publish a New Ride
          </CardTitle>
          <CardDescription>
            Share your journey and help reduce carbon emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CitySearch
                  label="From"
                  value={formData.fromCity}
                  onChange={(value) => handleInputChange("fromCity", value)}
                  placeholder="Select departure city"
                  error={errors.fromCity}
                />
                <div>
                  <Label htmlFor="fromAddress">Pickup Address</Label>
                  <Input
                    id="fromAddress"
                    placeholder="Exact pickup location"
                    value={formData.fromAddress}
                    onChange={(e) => handleInputChange("fromAddress", e.target.value)}
                    className={errors.fromAddress ? "border-red-500" : ""}
                  />
                  {errors.fromAddress && (
                    <p className="text-sm text-red-500 mt-1">{errors.fromAddress}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <CitySearch
                  label="To"
                  value={formData.toCity}
                  onChange={(value) => handleInputChange("toCity", value)}
                  placeholder="Select destination city"
                  error={errors.toCity}
                />
                <div>
                  <Label htmlFor="toAddress">Drop-off Address</Label>
                  <Input
                    id="toAddress"
                    placeholder="Exact drop-off location"
                    value={formData.toAddress}
                    onChange={(e) => handleInputChange("toAddress", e.target.value)}
                    className={errors.toAddress ? "border-red-500" : ""}
                  />
                  {errors.toAddress && (
                    <p className="text-sm text-red-500 mt-1">{errors.toAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleInputChange("departureDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.departureDate ? "border-red-500" : ""}
                  />
                  {errors.departureDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.departureDate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange("departureTime", e.target.value)}
                    className={errors.departureTime ? "border-red-500" : ""}
                  />
                  {errors.departureTime && (
                    <p className="text-sm text-red-500 mt-1">{errors.departureTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="returnTrip"
                    checked={formData.returnTrip}
                    onCheckedChange={(checked) => handleInputChange("returnTrip", checked)}
                  />
                  <Label htmlFor="returnTrip">Return Trip</Label>
                </div>

                {formData.returnTrip && (
                  <>
                    <div>
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => handleInputChange("returnDate", e.target.value)}
                        min={formData.departureDate || new Date().toISOString().split("T")[0]}
                        className={errors.returnDate ? "border-red-500" : ""}
                      />
                      {errors.returnDate && (
                        <p className="text-sm text-red-500 mt-1">{errors.returnDate}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="returnTime">Return Time</Label>
                      <Input
                        id="returnTime"
                        type="time"
                        value={formData.returnTime}
                        onChange={(e) => handleInputChange("returnTime", e.target.value)}
                        className={errors.returnTime ? "border-red-500" : ""}
                      />
                      {errors.returnTime && (
                        <p className="text-sm text-red-500 mt-1">{errors.returnTime}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Ride Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="availableSeats">Available Seats</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleInputChange("availableSeats", Math.max(1, formData.availableSeats - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="availableSeats"
                      type="number"
                      min={1}
                      max={8}
                      value={formData.availableSeats}
                      onChange={(e) => handleInputChange("availableSeats", parseInt(e.target.value))}
                      className={cn("text-center", errors.availableSeats ? "border-red-500" : "")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleInputChange("availableSeats", Math.min(8, formData.availableSeats + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.availableSeats && (
                    <p className="text-sm text-red-500 mt-1">{errors.availableSeats}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Price per Seat (MAD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                      className={cn("pl-10", errors.price ? "border-red-500" : "")}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional information about your ride..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="h-[120px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Ride"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
