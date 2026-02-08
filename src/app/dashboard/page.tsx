import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Store,
  ShoppingBag,
  ArrowRight,
  Plus,
  DollarSign,
  Users,
  Clock,
  Sparkles
} from "lucide-react"
import Link from "next/link"
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

  const quickActions = [
    { title: "New Order", href: "/dashboard/orders/new", icon: Plus, color: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" },
    { title: "Add Business", href: "/dashboard/businesses/new", icon: Store, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    { title: "View Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" },
  ]

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      change: "Total earnings",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/5"
    },
    {
      title: "Active Orders",
      value: data.activeOrders.toString(),
      change: "Orders in progress",
      icon: ShoppingBag,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/10 to-rose-500/5"
    },
    {
      title: "Total Customers",
      value: new Intl.NumberFormat().format(data.totalCustomers),
      change: "Unique customers",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-indigo-500/5"
    },
  ]

  return (
    <div className="space-y-8 py-2 h-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            {userPlan === "PREMIUM" && (
              <Badge variant="outline" className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 dark:border-amber-700 dark:from-amber-950/30 dark:to-yellow-950/20 dark:text-amber-400 text-xs uppercase font-bold tracking-wider shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-gray-900 dark:text-white capitalize">{session?.user?.name || "User"}</span>. Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hidden md:flex">
            <Clock className="h-4 w-4" />
            Last 24 Hours
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all hover:scale-105">
            <Plus className="h-4 w-4 mr-2" /> New Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${stat.color} ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer border-gray-200 dark:border-gray-800 h-full group">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Access {action.title.toLowerCase()}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Promotion Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-none shadow-xl mt-8 ring-1 ring-white/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        <CardContent className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-red-600/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg shrink-0 border border-red-500/30">
              <Store className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to launch your chatbot endpoint?</h3>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed">Create your first business and start taking orders via your own channel. Automate your sales today.</p>
            </div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white border-none font-semibold shadow-lg shadow-red-900/20 transition-all hover:scale-105 px-8 py-6 h-auto text-lg" asChild>
            <Link href="/onboarding">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
