import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadNFTToIPFS } from "@/lib/nft-generator"
import { mintNFT } from "@/lib/blockchain"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { claimCode } = await request.json()

    if (!claimCode) {
      return NextResponse.json({ error: "Claim code is required" }, { status: 400 })
    }

    // Find the event by claim code
    const event = await prisma.event.findUnique({
      where: { claimCode: claimCode.toUpperCase() },
      include: {
        _count: {
          select: { nfts: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Invalid claim code" }, { status: 404 })
    }

    if (!event.isActive) {
      return NextResponse.json({ error: "This event is no longer active" }, { status: 400 })
    }

    // Check if max supply reached
    if (event.maxSupply && event._count.nfts >= event.maxSupply) {
      return NextResponse.json({ error: "Maximum supply reached for this event" }, { status: 400 })
    }

    // Check if user already claimed this event
    const existingClaim = await prisma.nFT.findFirst({
      where: {
        userId: user.id,
        eventId: event.id,
      },
    })

    if (existingClaim) {
      return NextResponse.json({ error: "You have already claimed this NFT" }, { status: 400 })
    }

    // Generate unique token ID
    const tokenId = `${event.claimCode}-${nanoid(8)}`

    // Upload NFT metadata to IPFS
    const { metadataUri, imageUrl } = await uploadNFTToIPFS({
      eventName: event.name,
      eventDate: event.date,
      eventLocation: event.location,
      userName: user.email.split("@")[0],
      userEmail: user.email,
      tokenId,
      eventImageUrl: event.imageUrl,
    })

    // Mint NFT on blockchain
    let txHash = null
    if (user.walletAddress) {
      try {
        const mintResult = await mintNFT(user.walletAddress, metadataUri)
        txHash = mintResult.txHash
      } catch (error) {
        console.error("Failed to mint NFT on blockchain:", error)
        // We continue to save the record in DB even if minting fails, 
        // but you might want to handle this differently (e.g. return error)
        // For now, we'll just log it.
      }
    }

    // Create NFT record in database
    const nft = await prisma.nFT.create({
      data: {
        tokenId,
        metadataUri,
        imageUrl,
        userId: user.id,
        eventId: event.id,
        txHash,
      },
      include: {
        event: true,
      },
    })

    return NextResponse.json({
      success: true,
      nft: {
        id: nft.id,
        tokenId: nft.tokenId,
        metadataUri: nft.metadataUri,
        imageUrl: nft.imageUrl,
        event: {
          name: nft.event.name,
          date: nft.event.date,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Claim NFT error:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      if (error.message.includes("IPFS")) {
        return NextResponse.json({ error: "Failed to upload to IPFS. Please try again." }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to claim NFT" }, { status: 500 })
  }
}
