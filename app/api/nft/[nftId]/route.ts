import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ nftId: string }> }) {
  try {
    const user = await getCurrentUser()
    const { nftId } = await params

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
      include: {
        event: true,
        user: {
          select: {
            email: true,
            walletAddress: true,
          },
        },
      },
    })

    if (!nft) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    // Check ownership
    if (nft.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ nft })
  } catch (error) {
    console.error("[v0] Get NFT error:", error)
    return NextResponse.json({ error: "Failed to fetch NFT" }, { status: 500 })
  }
}
