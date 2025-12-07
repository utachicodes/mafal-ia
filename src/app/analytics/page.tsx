import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrisma } from "@/src/lib/db"
import { Users, MessageSquare, Store, ShoppingBag } from "lucide-react"

// Force dynamic rendering to fetch fresh data
export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const prisma = await getPrisma()

  // Parallel data fetching
  const [restaurantCount, messageCount, conversationCount, orderCount] = await Promise.all([
    prisma.restaurant.count(),
    prisma.messageLog.count(),
    prisma.conversation.count(),
    prisma.order?.count().catch(() => 0) // Handle case if order table isn't fully migrated yet
  ])

  const stats = [
    {
      title: "Active Restaurants",
      value: restaurantCount,
      desc: "Live locations",
      icon: Store,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Total Messages",
      value: messageCount,
      desc: "Processed via AI",
      icon: MessageSquare,
      color: "text-violet-500 bg-violet-500/10",
    },
    {
      title: "Conversations",
      value: conversationCount,
      desc: "Unique customer threads",
      icon: Users,
      color: "text-green-500 bg-green-500/10",
    },
    {
      title: "Total Orders",
      value: orderCount,
      desc: "Completed orders",
      icon: ShoppingBag,
      color: "text-orange-500 bg-orange-500/10",
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Platform-wide performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Real-time system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-dashed border-2 rounded-md">
            <p className="text-muted-foreground">Detailed activity chart coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
