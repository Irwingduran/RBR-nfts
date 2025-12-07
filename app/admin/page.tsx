import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { EventTable } from "@/components/event-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Ticket, Calendar } from "lucide-react"

export default async function AdminPage() {
  try {
    const user = await requireAdmin()

    // Fetch statistics
    const [totalUsers, totalNFTs, totalEvents, events] = await Promise.all([
      prisma.user.count(),
      prisma.nFT.count(),
      prisma.event.count(),
      prisma.event.findMany({
        include: {
          _count: {
            select: { nfts: true },
          },
        },
        orderBy: {
          date: "desc",
        },
      }),
    ])

    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={user} />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage events and monitor NFT claims</p>
            </div>
            <CreateEventDialog />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NFTs Claimed</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNFTs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEvents}</div>
              </CardContent>
            </Card>
          </div>

          {/* Events Table */}
          <EventTable events={events} />
        </main>
      </div>
    )
  } catch (error) {
    redirect("/dashboard")
  }
}
