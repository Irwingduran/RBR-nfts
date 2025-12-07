import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { uploadImageToIPFS, getIPFSGatewayURL } from "@/lib/pinata"

// Upload image to IPFS (admin only)
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to IPFS
    const ipfsUri = await uploadImageToIPFS(buffer, file.name)
    const gatewayUrl = getIPFSGatewayURL(ipfsUri)

    return NextResponse.json({
      ipfsUri,
      gatewayUrl,
    })
  } catch (error) {
    console.error("[v0] Upload to IPFS error:", error)
    if (error instanceof Error && error.message === "Forbidden: Admin access required") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 })
  }
}
