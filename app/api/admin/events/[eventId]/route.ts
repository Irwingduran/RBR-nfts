import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    await requireAdmin()
    const { eventId } = await params
    const body = await request.json()
    const { isActive } = body

    const event = await prisma.event.update({
      where: { id: eventId },
      data: { isActive },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Update event error:", error)
    if (error instanceof Error && error.message === "Forbidden: Admin access required") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}
