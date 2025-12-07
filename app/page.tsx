import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Ticket, Award, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
            Your Attendance, <span className="text-primary">Immortalized as NFTs</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Collect unique NFT badges for every event you attend. Build your digital legacy and prove your presence in
            the Web3 community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/dashboard">View Collection</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
              <Ticket className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Claims</h3>
            <p className="text-muted-foreground">
              Simply enter your event code and claim your NFT instantly. No crypto wallet required.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Unique Badges</h3>
            <p className="text-muted-foreground">
              Each NFT is unique to the event and stored permanently on IPFS for authenticity.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Verifiable</h3>
            <p className="text-muted-foreground">
              Powered by blockchain technology, your attendance proof is tamper-proof and verifiable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
