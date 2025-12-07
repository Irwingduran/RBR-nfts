"use client"

import { useMagic } from "@/components/providers/magic-provider"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { magic } = useMagic()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (email: string) => {
      if (!magic) {
        setError("Magic is not initialized")
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        // Generate Magic link and send to email
        const didToken = await magic.auth.loginWithMagicLink({ email })

        if (!didToken) {
          throw new Error("Failed to generate authentication token")
        }

        // Send token to backend to create session
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ didToken }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Login failed")
        }

        // Redirect to dashboard
        router.push("/dashboard")
        router.refresh()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login failed"
        setError(errorMessage)
        console.error("[v0] Login error:", err)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [magic, router],
  )

  const logout = useCallback(async () => {
    if (!magic) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await magic.user.logout()

      // Clear session cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      router.push("/login")
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed"
      setError(errorMessage)
      console.error("[v0] Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [magic, router])

  return {
    login,
    logout,
    isLoading,
    error,
  }
}
