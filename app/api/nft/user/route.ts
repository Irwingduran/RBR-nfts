import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all NFTs for the current user
export async function GET() {
  try {
    const user = await requireAuth()

    const nfts = await prisma.nFT.findMany({
      where: { userId: user.id },
      include: {
        event: true,
      },
      orderBy: {
        claimedAt: "desc",
      },
    })

    return NextResponse.json({ nfts })
  } catch (error) {
    console.error("[v0] Get user NFTs error:", error)

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 })
  }
}
