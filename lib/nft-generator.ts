import { uploadMetadataToIPFS, getIPFSGatewayURL } from "./pinata"

interface GenerateNFTParams {
  eventName: string
  eventDate: Date
  eventLocation: string | null
  userName: string
  userEmail: string
  tokenId: string
  eventImageUrl?: string | null
}

// Generate NFT metadata for an attendance badge
export async function generateNFTMetadata(params: GenerateNFTParams) {
  const { eventName, eventDate, eventLocation, userName, userEmail, tokenId, eventImageUrl } = params

  // Create a unique image URL (in production, this would be generated or uploaded)
  const imageUrl =
    eventImageUrl || `/placeholder.svg?height=500&width=500&query=${encodeURIComponent(`${eventName} NFT Badge`)}`

  // Build NFT metadata following ERC-721 standard
  const metadata = {
    name: `${eventName} - Attendance Badge`,
    description: `This NFT certifies attendance at ${eventName} on ${eventDate.toLocaleDateString()}. ${
      eventLocation ? `Location: ${eventLocation}` : ""
    }`,
    image: imageUrl,
    external_url: process.env.NEXT_PUBLIC_APP_URL || "https://nft-attendance.vercel.app",
    attributes: [
      {
        trait_type: "Event",
        value: eventName,
      },
      {
        trait_type: "Date",
        value: eventDate.toISOString(),
      },
      {
        trait_type: "Attendee",
        value: userName,
      },
      {
        trait_type: "Email",
        value: userEmail,
      },
      {
        trait_type: "Token ID",
        value: tokenId,
      },
    ],
  }

  if (eventLocation) {
    metadata.attributes.push({
      trait_type: "Location",
      value: eventLocation,
    })
  }

  return metadata
}

// Upload NFT metadata to IPFS and return the URI
export async function uploadNFTToIPFS(params: GenerateNFTParams): Promise<{ metadataUri: string; imageUrl: string }> {
  const metadata = await generateNFTMetadata(params)

  // Upload metadata to IPFS via Pinata
  const metadataUri = await uploadMetadataToIPFS(metadata)

  // Get the public gateway URL for the image
  const imageUrl = getIPFSGatewayURL(metadata.image)

  return {
    metadataUri,
    imageUrl,
  }
}
