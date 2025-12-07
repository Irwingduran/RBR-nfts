import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"

interface NFTCardProps {
  nft: {
    id: string
    imageUrl: string
    tokenId: string
    claimedAt: Date
    event: {
      name: string
      date: Date
      location: string | null
    }
  }
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-muted">
        <Image
          src={nft.imageUrl || "/placeholder.svg"}
          alt={nft.event.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">{nft.event.name}</h3>
          <Badge variant="secondary" className="text-xs">
            #{nft.tokenId}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(nft.event.date).toLocaleDateString()}</span>
          </div>
          {nft.event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{nft.event.location}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Claimed {new Date(nft.claimedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
