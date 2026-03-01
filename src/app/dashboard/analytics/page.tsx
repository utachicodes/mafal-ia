import { AnalyticsService } from "@/src/lib/analytics-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Store,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Download,
  Calendar,
  Activity,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const data = await AnalyticsService.getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      change: "All time",
      icon: CreditCard,
      trend: "+18%"
    },
    {
      title: "Active Businesses",
      value: data.activeRestaurants.toString(),
      change: "Currently running",
      icon: Store,
      trend: "Steady"
    },
    {
      title: "Total Orders",
      value: new Intl.NumberFormat().format(data.totalOrders),
      change: "All time",
      icon: ShoppingBag,
      trend: "+4.2k"
    },
    {
      title: "Conversations",
      value: new Intl.NumberFormat().format(data.conversationCount),
      change: "WhatsApp chats",
      icon: MessageSquare,
      trend: "+12%"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics and growth data for your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button className="rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
                <span className="text-muted-foreground ml-1">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 border border-border bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Revenue Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">Growth across all businesses</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center border-t border-border bg-muted/30">
            <div className="text-center space-y-2">
              <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Market Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Orders by region</p>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-5">
              {[
                { region: "Dakar", value: "65%", color: "bg-primary" },
                { region: "Abidjan", value: "20%", color: "bg-primary/60" },
                { region: "Banjul", value: "10%", color: "bg-primary/30" },
                { region: "Other", value: "5%", color: "bg-muted-foreground/30" },
              ].map((item) => (
                <div key={item.region}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{item.region}</span>
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
