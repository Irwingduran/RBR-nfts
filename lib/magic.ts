import { Magic } from "@magic-sdk/admin"

// Singleton instance
let magicAdmin: Magic | null = null

export const getMagicAdmin = () => {
  if (!magicAdmin) {
    const secretKey = process.env.MAGIC_SECRET_KEY

    if (!secretKey) {
      throw new Error("MAGIC_SECRET_KEY is not defined in environment variables")
    }

    magicAdmin = new Magic(secretKey)
  }

  return magicAdmin
}

// Validate Magic token and get user metadata
export async function validateMagicToken(didToken: string) {
  try {
    const magic = getMagicAdmin()
    magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)

    return {
      isValid: true,
      email: metadata.email,
      publicAddress: metadata.publicAddress,
      issuer: metadata.issuer,
    }
  } catch (error) {
    console.error("[v0] Magic token validation error:", error)
    return {
      isValid: false,
      email: null,
      publicAddress: null,
      issuer: null,
    }
  }
}
