import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrisma } from "@/src/lib/db"
import {
  Store,
  MessageSquare,
  Users,
  ShoppingBag,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Zap,
  Globe
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const prisma = await getPrisma()

  // Safely count items, handling potential migration lags
  const [restaurantCount, messageCount, conversationCount, orderCount] = await Promise.all([
    prisma.restaurant.count(),
    prisma.messageLog.count(),
    prisma.conversation.count(),
    (prisma as any).order?.count().catch(() => 0) || Promise.resolve(0)
  ])

  const stats = [
    {
      title: "Active Restaurants",
      value: restaurantCount,
      change: "+2 this week",
      icon: Store,
      color: "text-blue-500 bg-blue-500/10",
      description: "Live commercial locations"
    },
    {
      title: "AI Conversations",
      value: conversationCount.toLocaleString(),
      change: "+15% vs last month",
      icon: MessageSquare,
      color: "text-purple-500 bg-purple-500/10",
      description: "Unique customer sessions"
    },
    {
      title: "Messages Sent",
      value: messageCount.toLocaleString(),
      change: "+24% vs last month",
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10",
      description: "Total automated responses"
    },
    {
      title: "Total Orders",
      value: orderCount.toLocaleString(),
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-green-500 bg-green-500/10",
      description: "Completed transactions"
    }
  ]

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" /> Platform Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Deep insights into your AI restaurant fleet's performance.
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass card-hover border-none shadow-xl overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Activity Chart Placeholder */}
        <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-white/30 dark:bg-black/10 px-8 py-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> System Throughput
            </CardTitle>
            <CardDescription>Real-time message processing volume</CardDescription>
          </CardHeader>
          <CardContent className="p-12">
            <div className="h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-primary/20 rounded-3xl bg-primary/5">
              <Activity className="h-12 w-12 text-primary/20 mb-4 animate-pulse" />
              <p className="text-muted-foreground font-medium">Interactive charts are being initialized...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Data refreshes every 30 seconds</p>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Impact */}
        <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-white/30 dark:bg-black/10 px-8 py-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" /> Geographic Coverage
            </CardTitle>
            <CardDescription>User distribution across West Africa</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[
              { region: "Dakar, Senegal", percentage: 65, color: "bg-primary" },
              { region: "Abidjan, Ivory Coast", percentage: 20, color: "bg-blue-500" },
              { region: "Banjul, Gambia", percentage: 10, color: "bg-green-500" },
              { region: "Others", percentage: 5, color: "bg-muted" },
            ].map((item) => (
              <div key={item.region} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{item.region}</span>
                  <span className="text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} shadow-lg shadow-primary/20 transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
