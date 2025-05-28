import { Client, TravelMode } from "@googlemaps/google-maps-services-js"
import { PrismaClient, Ride, RideStatus, User } from "@prisma/client"
import { calculateCO2Savings } from "./carbon-service"
import { sendNotification } from "./notification-service"
import { checkAndUnlockAchievements } from "./achievement-service"

const prisma = new PrismaClient()
const googleMapsClient = new Client({})

interface CreateRideInput {
  driverId: string
  fromCity: string
  toCity: string
  fromAddress: string
  toAddress: string
  departureTime: Date
  returnTrip: boolean
  returnTime?: Date
  availableSeats: number
  price: number
  description?: string
  amenities: string[]
  pickupPoints: Array<{
    name: string
    address: string
  }>
}

interface Location {
  lat: number
  lng: number
  address: string
}

export class RideService {
  // Create a new ride with route calculation
  async createRide(input: CreateRideInput): Promise<Ride> {
    // Geocode the addresses
    const [fromLocation, toLocation] = await Promise.all([
      this.geocodeAddress(input.fromAddress),
      this.geocodeAddress(input.toAddress)
    ])

    // Calculate route details
    const route = await this.calculateRoute(fromLocation, toLocation)

    // Create the ride
    const ride = await prisma.ride.create({
      data: {
        driverId: input.driverId,
        fromCity: input.fromCity,
        toCity: input.toCity,
        fromLocation: fromLocation,
        toLocation: toLocation,
        distance: route.distance,
        duration: route.duration,
        departureTime: input.departureTime,
        returnTrip: input.returnTrip,
        returnTime: input.returnTime,
        availableSeats: input.availableSeats,
        price: input.price,
        description: input.description,
        amenities: input.amenities,
        co2Saved: 0, // Will be calculated when ride is completed
        pickupPoints: {
          create: await Promise.all(
            input.pickupPoints.map(async (point, index) => ({
              name: point.name,
              location: await this.geocodeAddress(point.address),
              order: index
            }))
          )
        }
      },
      include: {
        pickupPoints: true,
        driver: true
      }
    })

    // Send notification to driver
    await sendNotification({
      to: ride.driver.phone!,
      type: "RIDE_CREATED",
      data: {
        rideId: ride.id,
        from: input.fromCity,
        to: input.toCity,
        date: input.departureTime
      }
    })

    return ride
  }

  // Join a ride as a passenger
  async joinRide(rideId: string, userId: string, pickupPointId: string) {
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { passengers: true, driver: true }
    })

    if (!ride) throw new Error("Ride not found")
    if (ride.availableSeats <= ride.passengers.length) {
      throw new Error("No seats available")
    }

    const passenger = await prisma.ridePassenger.create({
      data: {
        rideId,
        userId,
        pickupPointId
      },
      include: {
        user: true
      }
    })

    // Send notifications
    await Promise.all([
      // Notify driver
      sendNotification({
        to: ride.driver.phone!,
        type: "NEW_PASSENGER",
        data: {
          rideId,
          passengerName: `${passenger.user.firstName} ${passenger.user.lastName}`
        }
      }),
      // Notify passenger
      sendNotification({
        to: passenger.user.phone!,
        type: "RIDE_JOINED",
        data: {
          rideId,
          from: ride.fromCity,
          to: ride.toCity,
          date: ride.departureTime
        }
      })
    ])

    return passenger
  }

  // Start a ride
  async startRide(rideId: string) {
    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: {
        status: RideStatus.IN_PROGRESS,
        currentLocation: await this.getCurrentLocation()
      },
      include: {
        passengers: {
          include: {
            user: true
          }
        },
        driver: true
      }
    })

    // Notify all participants
    await Promise.all([
      sendNotification({
        to: ride.driver.phone!,
        type: "RIDE_STARTED",
        data: { rideId }
      }),
      ...ride.passengers.map(passenger =>
        sendNotification({
          to: passenger.user.phone!,
          type: "RIDE_STARTED",
          data: { rideId }
        })
      )
    ])

    return ride
  }

  // Complete a ride
  async completeRide(rideId: string) {
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        driver: true,
        passengers: {
          include: {
            user: true
          }
        }
      }
    })

    if (!ride) throw new Error("Ride not found")

    // Calculate CO2 savings
    const co2Saved = await calculateCO2Savings({
      distance: ride.distance,
      vehicleType: ride.driver.vehicleType!,
      passengers: ride.passengers.length
    })

    // Update ride and user statistics
    const completedRide = await prisma.$transaction(async (prisma) => {
      // Update ride
      const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: {
          status: RideStatus.COMPLETED,
          co2Saved,
          currentLocation: null
        }
      })

      // Update driver statistics
      await prisma.user.update({
        where: { id: ride.driver.id },
        data: {
          totalCO2Saved: { increment: co2Saved },
          ecoPoints: { increment: Math.floor(co2Saved * 10) } // 10 points per kg of CO2 saved
        }
      })

      // Update passenger statistics
      for (const passenger of ride.passengers) {
        await prisma.user.update({
          where: { id: passenger.user.id },
          data: {
            totalCO2Saved: { increment: co2Saved / ride.passengers.length },
            ecoPoints: { increment: Math.floor((co2Saved * 5) / ride.passengers.length) } // 5 points per kg of CO2 saved
          }
        })
      }

      return updatedRide
    })

    // Check achievements for all participants
    await Promise.all([
      checkAndUnlockAchievements(ride.driver.id),
      ...ride.passengers.map(p => checkAndUnlockAchievements(p.user.id))
    ])

    // Send notifications
    await Promise.all([
      sendNotification({
        to: ride.driver.phone!,
        type: "RIDE_COMPLETED",
        data: {
          rideId,
          co2Saved,
          ecoPoints: Math.floor(co2Saved * 10)
        }
      }),
      ...ride.passengers.map(passenger =>
        sendNotification({
          to: passenger.user.phone!,
          type: "RIDE_COMPLETED",
          data: {
            rideId,
            co2Saved: co2Saved / ride.passengers.length,
            ecoPoints: Math.floor((co2Saved * 5) / ride.passengers.length)
          }
        })
      )
    ])

    return completedRide
  }

  // Update ride location (real-time tracking)
  async updateRideLocation(rideId: string, location: Location) {
    return prisma.ride.update({
      where: { id: rideId },
      data: {
        currentLocation: {
          ...location,
          timestamp: new Date()
        }
      }
    })
  }

  // Helper methods
  private async geocodeAddress(address: string): Promise<Location> {
    const response = await googleMapsClient.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY!
      }
    })

    if (response.data.results.length === 0) {
      throw new Error(`Could not geocode address: ${address}`)
    }

    const result = response.data.results[0]
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address
    }
  }

  private async calculateRoute(from: Location, to: Location) {
    const response = await googleMapsClient.directions({
      params: {
        origin: `${from.lat},${from.lng}`,
        destination: `${to.lat},${to.lng}`,
        mode: TravelMode.driving,
        key: process.env.GOOGLE_MAPS_API_KEY!
      }
    })

    if (response.data.routes.length === 0) {
      throw new Error("Could not calculate route")
    }

    const route = response.data.routes[0].legs[0]
    return {
      distance: route.distance.value / 1000, // Convert to kilometers
      duration: Math.ceil(route.duration.value / 60) // Convert to minutes
    }
  }

  private async getCurrentLocation(): Promise<Location> {
    // In a real implementation, this would get the location from the driver's device
    // For now, we'll return a dummy location
    return {
      lat: 0,
      lng: 0,
      address: "Current Location"
    }
  }
} 