import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { validateMagicToken } from "./magic"

const AUTH_COOKIE_NAME = "magic_did_token"

// Get current authenticated user
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const didToken = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!didToken) {
    return null
  }

  try {
    const validation = await validateMagicToken(didToken)

    if (!validation.isValid || !validation.email) {
      return null
    }

    // Find or create user
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

    return user
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}

// Check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === "ADMIN"
}

// Require authentication (throws if not authenticated)
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

// Require admin role (throws if not admin)
export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
  return user
}
