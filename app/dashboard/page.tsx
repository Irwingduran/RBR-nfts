import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from "@/components/dashboard-header"
import { NFTCard } from "@/components/nft-card"
import { ClaimNFTDialog } from "@/components/claim-nft-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's NFTs
  const nfts = await prisma.nFT.findMany({
    where: { userId: user.id },
    include: {
      event: true,
    },
    orderBy: {
      claimedAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My NFT Collection</h1>
            <p className="text-muted-foreground">
              {nfts.length === 0
                ? "Start collecting your attendance badges"
                : `${nfts.length} NFT${nfts.length !== 1 ? "s" : ""} collected`}
            </p>
          </div>
          <ClaimNFTDialog />
        </div>

        {/* NFT Grid */}
        {nfts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Attend events and claim your unique NFT badges to start building your collection.
              </p>
              <ClaimNFTDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
