"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    claimCode: "",
    maxSupply: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxSupply: formData.maxSupply ? Number.parseInt(formData.maxSupply) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event")
      }

      setSuccess(true)
      setFormData({
        name: "",
        description: "",
        date: "",
        location: "",
        claimCode: "",
        maxSupply: "",
        imageUrl: "",
      })

      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Add a new event for users to claim attendance NFTs.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Blockchain Conference 2024"
                required
                disabled={isLoading || success}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Annual blockchain and Web3 conference"
                rows={3}
                disabled={isLoading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                disabled={isLoading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
                disabled={isLoading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimCode">Claim Code *</Label>
              <Input
                id="claimCode"
                value={formData.claimCode}
                onChange={(e) => setFormData({ ...formData, claimCode: e.target.value.toUpperCase() })}
                placeholder="BLOCKCHAIN2024"
                className="uppercase"
                required
                disabled={isLoading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSupply">Max Supply</Label>
              <Input
                id="maxSupply"
                type="number"
                value={formData.maxSupply}
                onChange={(e) => setFormData({ ...formData, maxSupply: e.target.value })}
                placeholder="1000"
                disabled={isLoading || success}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.png"
                disabled={isLoading || success}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>Event created successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : success ? (
              "Created!"
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
