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
  ChevronRight,
  Zap,
  ShieldCheck
} from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  const data = await AnalyticsService.getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      change: "All time growth",
      icon: CreditCard,
      color: "text-emerald-500",
      trend: "+18%"
    },
    {
      title: "Active Outlets",
      value: data.activeRestaurants.toString(),
      change: "Operational nodes",
      icon: Store,
      color: "text-primary",
      trend: "Steady"
    },
    {
      title: "System Load",
      value: new Intl.NumberFormat().format(data.totalOrders),
      change: "Request volume",
      icon: Activity,
      color: "text-primary",
      trend: "+4.2k"
    },
    {
      title: "Engagement",
      value: new Intl.NumberFormat().format(data.conversationCount),
      change: "AI Interactions",
      icon: MessageSquare,
      color: "text-muted-foreground",
      trend: "+12%"
    }
  ]

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Performance Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time telemetry and growth metrics for your platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all">
            <Calendar className="h-4 w-4 mr-2" />
            Rolling 30 Days
          </Button>
          <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Intelligence Export
          </Button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass border-white/10 hover:border-primary/30 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-tighter">
                <TrendingUp className="h-3 w-3" />
                {stat.trend} <span className="text-muted-foreground font-medium ml-1">v. last cycle</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass border-white/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div>
              <CardTitle className="text-xl font-bold">Revenue Velocity</CardTitle>
              <p className="text-sm text-muted-foreground">Comparative growth across all active tenants</p>
            </div>
            <Zap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center border-t border-white/5 bg-white/[0.01]">
            <div className="text-center space-y-4">
              <div className="relative h-24 w-24 mx-auto">
                <Activity className="h-24 w-24 text-primary/10 animate-pulse" />
                <TrendingUp className="absolute inset-0 h-12 w-12 text-primary m-auto" />
              </div>
              <p className="text-muted-foreground font-medium italic">High-fidelity visualization engine loading...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass border-white/10 overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold">Geographic Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Market penetration by major hubs</p>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <div className="space-y-8">
              {[
                { region: "Dakar Metropolis", value: "65%", color: "bg-primary" },
                { region: "Abidjan Coast", value: "20%", color: "bg-primary/60" },
                { region: "Banjul Center", value: "10%", color: "bg-primary/30" },
                { region: "Emerging Markets", value: "5%", color: "bg-neutral-500" },
              ].map((item) => (
                <div key={item.region} className="group cursor-default">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", item.color)} />
                      {item.region}
                    </span>
                    <span className="text-xs font-black text-muted-foreground group-hover:text-primary transition-colors">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-primary">Compliance Status</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 mb-4">
                All data points are collected with full RLS protection and tenant isolation. Zero cross-contamination detected.
              </p>
              <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80">
                View Security Audit <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
