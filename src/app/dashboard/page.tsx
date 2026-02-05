import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  MessageSquare,
  Store,
  ShoppingBag,
  ArrowRight,
  Plus,
  Sparkles,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const quickActions = [
    { title: "New Restaurant", href: "/onboarding", icon: Plus, color: "bg-primary text-primary-foreground" },
    { title: "View Analytics", href: "/analytics", icon: BarChart3, color: "bg-blue-500/10 text-blue-500" },
    { title: "Manage Orders", href: "/orders", icon: ShoppingBag, color: "bg-orange-500/10 text-orange-500" },
  ]

  const stats = [
    { title: "Total Revenue", value: "145,000 FCFA", change: "+12.5%", icon: TrendingUp, color: "text-green-500" },
    { title: "Active Orders", value: "12", change: "+4 today", icon: Zap, color: "text-amber-500" },
    { title: "AI interactions", value: "1,284", change: "+85%", icon: Activity, color: "text-blue-500" },
  ]

  return (
    <div className="space-y-10 py-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient">
            Welcome back, Utachi
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI restaurant fleet is currently managing <span className="text-primary font-bold">3 locations</span> and <span className="text-primary font-bold">12 orders</span>.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2">
          <Link href="/onboarding">
            <Plus className="h-5 w-5" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass card-hover border-none shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transition-transform group-hover:scale-125 duration-500">
              <stat.icon className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium uppercase tracking-wider">{stat.title}</CardDescription>
              <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm font-bold flex items-center gap-1 ${stat.color}`}>
                <Sparkles className="h-3 w-3" />
                {stat.change} <span className="text-muted-foreground font-normal ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 glass border-white/20 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Quick Actions
            </CardTitle>
            <CardDescription>Commonly used operations</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all group">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">{action.title}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Live System Feed */}
        <Card className="lg:col-span-2 glass border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-white/30 dark:bg-black/10 px-8 py-6">
            <div>
              <CardTitle className="text-xl">Live System Feed</CardTitle>
              <CardDescription>Real-time updates from your AI agents</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full text-primary hover:bg-primary/5" asChild>
              <Link href="/analytics">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { time: "2m ago", user: "+221 77 123...", msg: "Confirmed order at 'Chez Fatou'", status: "success" },
                { time: "15m ago", user: "+221 78 542...", msg: "Inquiring about menu items at 'Le Terrou'", status: "pending" },
                { time: "1h ago", user: "System", msg: "AI model updated for better menu matching", status: "system" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 px-8 py-5 hover:bg-primary/5 transition-colors">
                  <div className="text-xs font-mono text-muted-foreground w-16">{item.time}</div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold tracking-tight">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.msg}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-muted/50">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

