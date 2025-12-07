import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getIPFSGatewayURL } from "@/lib/pinata"

// Public endpoint to fetch NFT metadata (for wallets and marketplaces)
export async function GET(request: Request, { params }: { params: Promise<{ tokenId: string }> }) {
  try {
    const { tokenId } = await params

    const nft = await prisma.nFT.findUnique({
      where: { tokenId },
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

    // Return standard ERC-721 metadata
    const metadata = {
      name: `${nft.event.name} - Attendance Badge`,
      description: `This NFT certifies attendance at ${nft.event.name} on ${nft.event.date.toLocaleDateString()}.${
        nft.event.location ? ` Location: ${nft.event.location}` : ""
      }`,
      image: getIPFSGatewayURL(nft.imageUrl),
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://nft-attendance.vercel.app"}/nft/${nft.id}`,
      attributes: [
        {
          trait_type: "Event",
          value: nft.event.name,
        },
        {
          trait_type: "Date",
          value: nft.event.date.toISOString(),
        },
        {
          trait_type: "Claimed At",
          value: nft.claimedAt.toISOString(),
        },
        {
          trait_type: "Token ID",
          value: nft.tokenId,
        },
      ],
    }

    if (nft.event.location) {
      metadata.attributes.push({
        trait_type: "Location",
        value: nft.event.location,
      })
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error("[v0] Get metadata error:", error)
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}
