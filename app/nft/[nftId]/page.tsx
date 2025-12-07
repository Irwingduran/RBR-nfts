import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ExternalLink, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function NFTDetailPage({ params }: { params: Promise<{ nftId: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { nftId } = await params

  const nft = await prisma.nFT.findUnique({
    where: { id: nftId },
    include: {
      event: true,
      user: {
        select: {
          email: true,
          walletAddress: true,
        },
      },
    },
  })

  if (!nft) {
    notFound()
  }

  // Check ownership
  if (nft.userId !== user.id && user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Collection</Link>
            </Button>
          </div>

          {/* NFT Detail */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                <Image src={nft.imageUrl || "/placeholder.svg"} alt={nft.event.name} fill className="object-cover" />
              </div>
            </Card>

            {/* Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{nft.event.name}</CardTitle>
                      <CardDescription>Attendance NFT Badge</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      #{nft.tokenId}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(nft.event.date).toLocaleDateString()}</span>
                    </div>
                    {nft.event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{nft.event.location}</span>
                      </div>
                    )}
                  </div>

                  {nft.event.description && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{nft.event.description}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <strong>Claimed:</strong> {new Date(nft.claimedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Owner:</strong> {nft.user.email}
                    </div>
                    {nft.user.walletAddress && (
                      <div className="text-xs text-muted-foreground font-mono">
                        <strong>Wallet:</strong> {nft.user.walletAddress.slice(0, 6)}...
                        {nft.user.walletAddress.slice(-4)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Metadata URI</span>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs font-mono break-all">{nft.metadataUri}</div>

                  <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                    <a href={`/api/nft/metadata/${nft.tokenId}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Metadata
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
