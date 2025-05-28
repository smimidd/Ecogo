import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        vehicleType: true,
        vehicleModel: true,
        totalCO2Saved: true,
        ecoPoints: true,
        createdAt: true,
        ridesAsDriver: {
          where: { status: "COMPLETED" },
          select: { id: true, distance: true }
        },
        ridesAsPassenger: {
          where: { status: "ACCEPTED" },
          select: { id: true }
        },
        ratings: {
          select: { rating: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const ratings = user.ratings.map((r: { rating: number }) => r.rating)
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : "0.0"

    // Calculate environmental impact
    const totalDistance = user.ridesAsDriver.reduce((acc: number, ride: { distance?: number }) => acc + (ride.distance || 0), 0)
    const treesEquivalent = (user.totalCO2Saved || 0) / 21 // Average tree absorbs 21kg CO2 per year
    const gasSaved = (totalDistance * 0.12) // Average 0.12L of gas per km
    
    // Prepare dashboard data with environmental impact
    const dashboardData = {
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        vehicleType: user.vehicleType || "Not specified",
        vehicleModel: user.vehicleModel || "Not specified",
        memberSince: user.createdAt
      },
      stats: {
        ridesCompleted: user.ridesAsDriver.length + user.ridesAsPassenger.length || 0,
        co2Saved: (user.totalCO2Saved || 0).toFixed(1),
        ecoPoints: user.ecoPoints || 0,
        rating: averageRating || "0.0"
      },
      environmentalImpact: {
        treesEquivalent: treesEquivalent.toFixed(1),
        gasSaved: gasSaved.toFixed(1),
        totalDistance: totalDistance.toFixed(1),
        achievements: [
          {
            title: "Earth Guardian",
            description: "You've started your journey to protect our planet",
            unlocked: true,
            progress: 100
          },
          {
            title: "Carbon Crusher",
            description: "Save 100kg of CO2",
            unlocked: (user.totalCO2Saved || 0) >= 100,
            progress: Math.min(((user.totalCO2Saved || 0) / 100) * 100, 100)
          },
          {
            title: "Forest Friend",
            description: "Equivalent to planting 10 trees",
            unlocked: treesEquivalent >= 10,
            progress: Math.min((treesEquivalent / 10) * 100, 100)
          }
        ],
        tips: [
          "Did you know? A single tree can absorb up to 21kg of CO2 per year!",
          "Carpooling just twice a week can reduce your carbon footprint by 1,600kg annually",
          "By sharing rides, you're helping reduce traffic congestion and air pollution",
          "Every kilometer shared is a step towards a cleaner planet"
        ]
      }
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
} 