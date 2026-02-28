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
import { Badge } from "@/components/ui/badge"
import { AnalyticsService } from "@/src/lib/analytics-service"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const userPlan = "PREMIUM"
  const data = await AnalyticsService.getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "text-primary"
    },
    {
      title: "Active Orders",
      value: data.activeOrders.toString(),
      icon: ShoppingBag,
      trend: "In progress",
      color: "text-primary"
    },
    {
      title: "Customers",
      value: new Intl.NumberFormat().format(data.totalCustomers),
      icon: Users,
      trend: "+4.2%",
      color: "text-muted-foreground"
    },
  ]

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black tracking-tighter text-gradient py-2">
              Dashboard
            </h1>
            {userPlan === "PREMIUM" && (
              <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 transition-all font-bold py-1.5 px-4">
                Premium
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg font-medium opacity-80">
            Welcome back, <span className="text-foreground font-bold border-b-2 border-primary/20">Admin</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] border border-white/20">
            <Link href="/dashboard/businesses/new">
              <Plus className="h-5 w-5 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-white/10 hover:border-primary/40 transition-all duration-500 group overflow-hidden relative neural-border py-4">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Performance Chart Area */}
        <Card className="lg:col-span-4 glass border-white/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Order volume and revenue over time</p>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-white/5 bg-white/[0.02]">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-medium italic">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3 glass border-white/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl text-gradient">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Link href="/dashboard/orders/new">
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">New Order</h4>
                    <p className="text-xs text-muted-foreground">Manual entry</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/dashboard/businesses/new">
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Add Business</h4>
                    <p className="text-xs text-muted-foreground">Set up a new restaurant</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="mt-8 p-8 rounded-[2rem] premium-gradient relative overflow-hidden group neural-border">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-transform duration-700 group-hover:scale-150" />
              <h4 className="text-white font-black text-2xl mb-2 relative z-10 tracking-tighter">Upgrade to Premium</h4>
              <p className="text-white/70 text-sm mb-6 relative z-10 leading-relaxed">Unlock advanced features, higher limits, and priority support.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl relative z-10 h-12 font-black shadow-xl">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
