import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
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
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AnalyticsService } from "@/src/lib/analytics-service"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userPlan = (session?.user as any)?.plan || "STANDARD"
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
      color: "text-blue-500"
    },
    {
      title: "Customers",
      value: new Intl.NumberFormat().format(data.totalCustomers),
      icon: Users,
      trend: "+4.2%",
      color: "text-purple-500"
    },
  ]

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">
              System Overview
            </h1>
            {userPlan === "PREMIUM" && (
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1 px-3">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="text-foreground font-medium">{session?.user?.name || "User"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-5 w-5 mr-2" />
            Create Listing
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

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
        {/* Activity Feed / Main Chart Area */}
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
              <p className="text-muted-foreground font-medium italic">Analytics visualization loading...</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Businesses */}
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
                    <p className="text-xs text-muted-foreground">Manual entry system</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/dashboard/businesses/new">
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Add Business</h4>
                    <p className="text-xs text-muted-foreground">Setup multi-tenancy</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="mt-8 p-6 rounded-2xl premium-gradient relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <h4 className="text-white font-bold text-lg mb-2 relative z-10">Upgrade to Pro</h4>
              <p className="text-white/70 text-sm mb-4 relative z-10">Get advanced RAG insights and priority support.</p>
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-xl relative z-10">
                Join Private Beta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
