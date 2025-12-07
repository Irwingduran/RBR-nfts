"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface MetadataPreviewProps {
  eventId: string
  eventName: string
  eventDate: Date
  eventLocation: string | null
  eventImageUrl?: string | null
}

export function MetadataPreview({ eventName, eventDate, eventLocation, eventImageUrl }: MetadataPreviewProps) {
  const [metadata, setMetadata] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePreview = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ipfs/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventDate,
          eventLocation,
          userName: "John Doe",
          userEmail: "john@example.com",
          tokenId: "PREVIEW-001",
          eventImageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate preview")
      }

      setMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate preview")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Metadata Preview</CardTitle>
        <CardDescription>Preview how the NFT metadata will look for this event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generatePreview} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Preview"
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {metadata && (
          <div className="rounded-md border p-4">
            <pre className="text-sm overflow-auto">{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
