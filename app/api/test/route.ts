import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Try to count users as a simple test
    const count = await prisma.user.count()
    return NextResponse.json({ status: "Connected", userCount: count })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { error: "Failed to connect to database", details: error },
      { status: 500 }
    )
  }
} 