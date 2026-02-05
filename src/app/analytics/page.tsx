"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Store,
  MessageSquare,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  Zap,
  Globe,
  Crown
} from "lucide-react"

export default function AnalyticsPage() {
  const { data: session } = useSession()
  // Cast session user to any to access the custom 'plan' property
  const isPremium = (session?.user as any)?.plan === "PREMIUM"

  const stats = [
    {
      title: "Commercial Hubs",
      value: "12",
      change: "+2 new",
      icon: Store,
      color: "text-blue-500 bg-blue-500/10",
      description: "Live restaurant endpoints"
    },
    {
      title: "AI Interactions",
      value: "14,208",
      change: "+15% growth",
      icon: MessageSquare,
      color: "text-purple-500 bg-purple-500/10",
      description: "Unique customer sessions"
    },
    {
      title: "Processed Responses",
      value: "85,420",
      change: "+24% vs LY",
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10",
      description: "Automated AI execution"
    },
    {
      title: "Revenue Stream",
      value: "2.4M",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-green-500 bg-green-500/10",
      description: "Completed transactions"
    }
  ]

  return (
    <div className="space-y-12 py-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Activity className="h-3 w-3" /> System Analytics
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gradient flex items-center gap-4">
            Platform Analytics
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Monitor your restaurant network's efficiency and growth metrics.
          </p>
        </div>
        {!isPremium && (
          <Button className="rounded-2xl gap-3 font-black bg-gradient-to-r from-amber-500 to-primary text-white border-none shadow-xl shadow-primary/20 hover:scale-105 transition-all p-6">
            <Crown className="h-5 w-5" />
            Unlock Advanced Insights
          </Button>
        )}
      </div>

      {/* Hero Stats */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass border-none shadow-2xl rounded-[32px] overflow-hidden card-hover group transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-8">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-4 rounded-2xl ${stat.color} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-xl shadow-current/10`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-4xl font-black tracking-tight group-hover:text-primary transition-colors text-gradient">{stat.value}</div>
              <div className="flex items-center gap-1.5 mt-2 text-sm font-black text-green-500 bg-green-500/5 w-fit px-2 py-0.5 rounded-lg">
                <ArrowUpRight className="h-4 w-4 stroke-[3]" />
                {stat.change}
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-bold opacity-70 italic">
                / {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Activity Chart Placeholder */}
        <Card className="glass border-none shadow-3xl rounded-[40px] overflow-hidden group">
          <CardHeader className="bg-white/40 dark:bg-black/20 p-10">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" /> Performance Metrics
            </CardTitle>
            <CardDescription className="text-lg font-medium opacity-80">Real-time throughput & message volume</CardDescription>
          </CardHeader>
          <CardContent className="p-12">
            <div className="h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-primary/20 rounded-[32px] bg-primary/5 transition-all group-hover:bg-primary/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <Activity className="h-20 w-20 text-primary/20 mb-6 relative z-10" />
              <p className="text-xl font-black text-primary/40 relative z-10">SYSTEM PERFORMANCE</p>
              <p className="text-xs text-muted-foreground/60 mt-2 font-bold tracking-widest relative z-10 uppercase">Live Data Feed</p>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Impact */}
        <Card className="glass border-none shadow-3xl rounded-[40px] overflow-hidden relative group">
          {!isPremium && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
              <div className="p-6 rounded-3xl bg-amber-500/20 border border-amber-500/20 mb-6 animate-bounce">
                <Crown className="h-12 w-12 text-amber-500 font-black" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter mb-4 text-gradient from-amber-200 to-amber-500">Premium Intelligence Required</h2>
              <p className="text-white/70 font-medium max-w-sm mb-8 px-6">
                Unlock deeper geographic insights and heatmap distributions with the Premium AI Expansion pack.
              </p>
              <Button className="rounded-2xl gap-2 font-black bg-amber-500 hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 px-8 py-6">
                Upgrade your Plan
              </Button>
            </div>
          )}
          <CardHeader className="bg-white/40 dark:bg-black/20 p-10">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-500" /> Geo-Strategic Distribution
            </CardTitle>
            <CardDescription className="text-lg font-medium opacity-80">Regional impact and market penetration statistics</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            {[
              { region: "Dakar Metropolis", percentage: 65, color: "bg-primary shadow-primary/40" },
              { region: "Abidjan Commercial District", percentage: 20, color: "bg-blue-500 shadow-blue-500/40" },
              { region: "Banjul Free Zone", percentage: 10, color: "bg-green-500 shadow-green-500/40" },
              { region: "Emerging Markets", percentage: 5, color: "bg-muted shadow-transparent" },
            ].map((item) => (
              <div key={item.region} className="space-y-4">
                <div className="flex justify-between text-base font-black tracking-tight items-end">
                  <span className="flex items-center gap-2 transition-transform hover:translate-x-2 cursor-default group-hover:text-primary">
                    <div className={`h-2 w-2 rounded-full ${item.color.split(' ')[0]}`} />
                    {item.region}
                  </span>
                  <span className="text-muted-foreground text-sm font-bold opacity-60 tabular-nums">{item.percentage}%</span>
                </div>
                <div className="h-3 w-full bg-white/30 dark:bg-black/10 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${item.color} shadow-lg transition-all duration-1000 ease-out animate-in slide-in-from-left-0`}
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
