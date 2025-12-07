import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { validateMagicToken } from "@/lib/magic"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { didToken } = await request.json()

    if (!didToken) {
      return NextResponse.json({ error: "Missing DID token" }, { status: 400 })
    }

    // Validate the Magic token
    const validation = await validateMagicToken(didToken)

    if (!validation.isValid || !validation.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: validation.email },
      update: {
        walletAddress: validation.publicAddress || undefined,
      },
      create: {
        email: validation.email,
        walletAddress: validation.publicAddress || undefined,
      },
    })

    // Set authentication cookie
    const cookieStore = await cookies()
    cookieStore.set("magic_did_token", didToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
