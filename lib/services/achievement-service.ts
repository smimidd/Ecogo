import { PrismaClient, AchievementType } from "@prisma/client"
import { sendNotification } from "./notification-service"

const prisma = new PrismaClient()

// Define achievements
const achievements = [
  {
    title: "First Ride",
    description: "Complete your first ride",
    type: AchievementType.RIDES_COMPLETED,
    threshold: 1
  },
  {
    title: "Regular Rider",
    description: "Complete 10 rides",
    type: AchievementType.RIDES_COMPLETED,
    threshold: 10
  },
  {
    title: "Eco Warrior",
    description: "Complete 50 rides",
    type: AchievementType.RIDES_COMPLETED,
    threshold: 50
  },
  {
    title: "CO2 Saver",
    description: "Save 100kg of CO2",
    type: AchievementType.CO2_SAVED,
    threshold: 100
  },
  {
    title: "Climate Champion",
    description: "Save 500kg of CO2",
    type: AchievementType.CO2_SAVED,
    threshold: 500
  },
  {
    title: "Earth Guardian",
    description: "Save 1000kg of CO2",
    type: AchievementType.CO2_SAVED,
    threshold: 1000
  },
  {
    title: "Explorer",
    description: "Travel 1000km",
    type: AchievementType.DISTANCE_TRAVELED,
    threshold: 1000
  },
  {
    title: "Globetrotter",
    description: "Travel 5000km",
    type: AchievementType.DISTANCE_TRAVELED,
    threshold: 5000
  },
  {
    title: "Five Stars",
    description: "Receive 10 five-star ratings",
    type: AchievementType.POSITIVE_RATINGS,
    threshold: 10
  },
  {
    title: "Point Collector",
    description: "Earn 1000 eco points",
    type: AchievementType.ECO_POINTS,
    threshold: 1000
  }
]

// Initialize achievements in database
export async function initializeAchievements() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        title: achievement.title
      },
      update: achievement,
      create: achievement
    })
  }
}

// Check and unlock achievements for a user
export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ridesAsDriver: true,
      ridesAsPassenger: true,
      ratings: true,
      achievements: {
        include: {
          achievement: true
        }
      }
    }
  })

  if (!user) return

  // Calculate user stats
  const stats = {
    ridesCompleted: user.ridesAsDriver.length + user.ridesAsPassenger.length,
    co2Saved: user.totalCO2Saved,
    distanceTraveled: calculateTotalDistance(user.ridesAsDriver, user.ridesAsPassenger),
    positiveRatings: user.ratings.filter(r => r.rating === 5).length,
    ecoPoints: user.ecoPoints
  }

  // Get all achievements
  const allAchievements = await prisma.achievement.findMany()

  // Check each achievement
  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (user.achievements.some(ua => ua.achievementId === achievement.id)) {
      continue
    }

    // Check if achievement should be unlocked
    let progress = 0
    switch (achievement.type) {
      case AchievementType.RIDES_COMPLETED:
        progress = stats.ridesCompleted
        break
      case AchievementType.CO2_SAVED:
        progress = stats.co2Saved
        break
      case AchievementType.DISTANCE_TRAVELED:
        progress = stats.distanceTraveled
        break
      case AchievementType.POSITIVE_RATINGS:
        progress = stats.positiveRatings
        break
      case AchievementType.ECO_POINTS:
        progress = stats.ecoPoints
        break
    }

    if (progress >= achievement.threshold) {
      // Unlock achievement
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
          progress
        }
      })

      // Send notification
      if (user.phone) {
        await sendNotification({
          to: user.phone,
          type: "ACHIEVEMENT_UNLOCKED",
          data: {
            from: achievement.title
          }
        })
      }
    }
  }
}

// Helper function to calculate total distance
function calculateTotalDistance(driverRides: any[], passengerRides: any[]): number {
  const driverDistance = driverRides.reduce((sum, ride) => sum + (ride.distance || 0), 0)
  const passengerDistance = passengerRides.reduce((sum, ride) => sum + (ride.distance || 0), 0)
  return driverDistance + passengerDistance
}

// Get user achievements with progress
export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true
    },
    orderBy: {
      unlockedAt: "desc"
    }
  })
}

// Get achievement progress for a user
export async function getAchievementProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ridesAsDriver: true,
      ridesAsPassenger: true,
      ratings: true,
      achievements: {
        include: {
          achievement: true
        }
      }
    }
  })

  if (!user) return []

  const stats = {
    ridesCompleted: user.ridesAsDriver.length + user.ridesAsPassenger.length,
    co2Saved: user.totalCO2Saved,
    distanceTraveled: calculateTotalDistance(user.ridesAsDriver, user.ridesAsPassenger),
    positiveRatings: user.ratings.filter(r => r.rating === 5).length,
    ecoPoints: user.ecoPoints
  }

  const allAchievements = await prisma.achievement.findMany()

  return allAchievements.map(achievement => {
    const userAchievement = user.achievements.find(ua => ua.achievementId === achievement.id)
    let progress = 0

    switch (achievement.type) {
      case AchievementType.RIDES_COMPLETED:
        progress = stats.ridesCompleted
        break
      case AchievementType.CO2_SAVED:
        progress = stats.co2Saved
        break
      case AchievementType.DISTANCE_TRAVELED:
        progress = stats.distanceTraveled
        break
      case AchievementType.POSITIVE_RATINGS:
        progress = stats.positiveRatings
        break
      case AchievementType.ECO_POINTS:
        progress = stats.ecoPoints
        break
    }

    return {
      ...achievement,
      progress,
      isUnlocked: !!userAchievement,
      unlockedAt: userAchievement?.unlockedAt
    }
  })
} 