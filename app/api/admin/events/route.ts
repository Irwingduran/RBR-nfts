import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { name, description, date, location, claimCode, maxSupply, imageUrl } = body

    if (!name || !date || !claimCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if claim code already exists
    const existing = await prisma.event.findUnique({
      where: { claimCode },
    })

    if (existing) {
      return NextResponse.json({ error: "Claim code already exists" }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        name,
        description: description || null,
        date: new Date(date),
        location: location || null,
        claimCode: claimCode.toUpperCase(),
        maxSupply: maxSupply || null,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Create event error:", error)
    if (error instanceof Error && error.message === "Forbidden: Admin access required") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
