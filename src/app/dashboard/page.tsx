import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Store,
  ShoppingBag,
  ArrowRight,
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  Activity
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnalyticsService } from "@/src/lib/analytics-service"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const data = await AnalyticsService.getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Active Orders",
      value: data.activeOrders.toString(),
      icon: ShoppingBag,
      trend: "In progress",
      trendUp: true,
    },
    {
      title: "Customers",
      value: new Intl.NumberFormat().format(data.totalCustomers),
      icon: Users,
      trend: "+4.2%",
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground font-medium">Admin</span>
          </p>
        </div>
        <Button asChild className="rounded-lg px-5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/dashboard/businesses/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Business
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-border bg-card">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Performance Chart Area */}
        <Card className="lg:col-span-4 border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Order volume and revenue over time</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-border bg-muted/30">
            <div className="text-center space-y-2">
              <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3 border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <Link href="/dashboard/orders/new">
              <div className="group flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">New Order</h4>
                    <p className="text-xs text-muted-foreground">Manual entry</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>

            <Link href="/dashboard/businesses/new">
              <div className="group flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Add Business</h4>
                    <p className="text-xs text-muted-foreground">Set up a new restaurant</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>

            <div className="mt-6 p-6 rounded-xl bg-primary text-primary-foreground">
              <h4 className="font-semibold text-lg mb-1">Upgrade to Premium</h4>
              <p className="text-primary-foreground/70 text-sm mb-4">Unlock advanced features, higher limits, and priority support.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-lg h-10 font-medium">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
