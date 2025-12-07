import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { generateNFTMetadata } from "@/lib/nft-generator"

// Generate NFT metadata preview (admin only)
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { eventName, eventDate, eventLocation, userName, userEmail, tokenId, eventImageUrl } = body

    if (!eventName || !eventDate || !userName || !userEmail || !tokenId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const metadata = await generateNFTMetadata({
      eventName,
      eventDate: new Date(eventDate),
      eventLocation: eventLocation || null,
      userName,
      userEmail,
      tokenId,
      eventImageUrl: eventImageUrl || null,
    })

    return NextResponse.json({ metadata })
  } catch (error) {
    console.error("[v0] Generate metadata error:", error)
    if (error instanceof Error && error.message === "Forbidden: Admin access required") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 })
  }
}
