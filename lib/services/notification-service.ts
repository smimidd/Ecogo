import nodemailer from "nodemailer"
import webpush from "web-push"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Configure web push
webpush.setVapidDetails(
  `mailto:${process.env.SMTP_USER}`,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

interface NotificationData {
  rideId?: string
  from?: string
  to?: string
  date?: Date
  passengerName?: string
  co2Saved?: number
  ecoPoints?: number
}

interface NotificationInput {
  userId: string // Changed from phone number to userId
  type: NotificationType
  data: NotificationData
}

type NotificationType =
  | "RIDE_CREATED"
  | "NEW_PASSENGER"
  | "RIDE_JOINED"
  | "RIDE_STARTED"
  | "RIDE_COMPLETED"
  | "ACHIEVEMENT_UNLOCKED"

const templates = {
  RIDE_CREATED: (data: NotificationData) => ({
    subject: "Ride Created Successfully",
    text: `Your ride from ${data.from} to ${data.to} on ${formatDate(data.date!)} has been created! Ride ID: ${data.rideId}`
  }),

  NEW_PASSENGER: (data: NotificationData) => ({
    subject: "New Passenger Request",
    text: `${data.passengerName} has requested to join your ride (ID: ${data.rideId})`
  }),

  RIDE_JOINED: (data: NotificationData) => ({
    subject: "Ride Joined Successfully",
    text: `You've joined the ride from ${data.from} to ${data.to} on ${formatDate(data.date!)}`
  }),

  RIDE_STARTED: (data: NotificationData) => ({
    subject: "Ride Started",
    text: `Your ride (ID: ${data.rideId}) has started. Have a safe journey!`
  }),

  RIDE_COMPLETED: (data: NotificationData) => ({
    subject: "Ride Completed",
    text: `Ride completed! You saved ${data.co2Saved?.toFixed(2)}kg of CO2 and earned ${data.ecoPoints} eco points!`
  }),

  ACHIEVEMENT_UNLOCKED: (data: NotificationData) => ({
    subject: "New Achievement Unlocked! 🏆",
    text: `Congratulations! You've unlocked a new achievement: ${data.from}`
  })
}

export async function sendNotification({ userId, type, data }: NotificationInput) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        pushSubscription: true
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const template = templates[type](data)

    // Send email notification
    await sendEmail(user.email, template.subject, template.text)

    // Send push notification if user has subscribed
    if (user.pushSubscription) {
      await sendPushNotification(user.pushSubscription, {
        title: template.subject,
        body: template.text
      })
    }

    console.log(`Notification sent to user ${userId}`)
  } catch (error) {
    console.error("Error sending notification:", error)
    // Don't throw error - notification failure shouldn't break the main flow
  }
}

async function sendEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "EcoRide <noreply@ecoride.com>",
    to,
    subject,
    text
  })
}

async function sendPushNotification(subscription: any, data: { title: string; body: string }) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: data.title,
        body: data.body,
        icon: "/icon.png", // Add your app icon path
        badge: "/badge.png", // Add your notification badge path
        data: {
          url: process.env.NEXT_PUBLIC_APP_URL // URL to open when notification is clicked
        }
      })
    )
  } catch (error) {
    console.error("Push notification error:", error)
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
} 