"use client"

import { Magic } from "magic-sdk"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface MagicContextType {
  magic: Magic | null
  isLoading: boolean
}

const MagicContext = createContext<MagicContextType>({
  magic: null,
  isLoading: true,
})

export function MagicProvider({ children }: { children: ReactNode }) {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error("[v0] NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY is not defined")
      setIsLoading(false)
      return
    }

    try {
      const magicInstance = new Magic(publishableKey)
      setMagic(magicInstance)
    } catch (error) {
      console.error("[v0] Error initializing Magic SDK:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return <MagicContext.Provider value={{ magic, isLoading }}>{children}</MagicContext.Provider>
}

export function useMagic() {
  const context = useContext(MagicContext)
  if (context === undefined) {
    throw new Error("useMagic must be used within a MagicProvider")
  }
  return context
}
