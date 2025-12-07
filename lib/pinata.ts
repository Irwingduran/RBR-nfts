import axios from "axios"

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET
const PINATA_JWT = process.env.PINATA_JWT

const pinataAxios = axios.create({
  baseURL: "https://api.pinata.cloud",
  headers: PINATA_JWT
    ? { Authorization: `Bearer ${PINATA_JWT}` }
    : {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
})

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
}

// Upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
  try {
    const response = await pinataAxios.post("/pinning/pinJSONToIPFS", metadata, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    const ipfsHash = response.data.IpfsHash
    return `ipfs://${ipfsHash}`
  } catch (error) {
    console.error("[v0] Error uploading metadata to IPFS:", error)
    throw new Error("Failed to upload metadata to IPFS")
  }
}

// Upload image to IPFS
export async function uploadImageToIPFS(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    const formData = new FormData()
    const blob = new Blob([imageBuffer])
    formData.append("file", blob, filename)

    const response = await pinataAxios.post("/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    const ipfsHash = response.data.IpfsHash
    return `ipfs://${ipfsHash}`
  } catch (error) {
    console.error("[v0] Error uploading image to IPFS:", error)
    throw new Error("Failed to upload image to IPFS")
  }
}

// Get IPFS gateway URL
export function getIPFSGatewayURL(ipfsUri: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud"
  
  if (ipfsUri.startsWith("ipfs://")) {
    const hash = ipfsUri.replace("ipfs://", "")
    return `${gateway}/ipfs/${hash}`
  }
  return ipfsUri
}
