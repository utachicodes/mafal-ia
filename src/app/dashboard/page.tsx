"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Store,
  ShoppingBag,
  ArrowRight,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { data: session } = useSession()
  const userPlan = (session?.user as any)?.plan || "STANDARD"

  const quickActions = [
    { title: "New Order", href: "/orders/new", icon: Plus, color: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" },
    { title: "Add Restaurant", href: "/restaurants/new", icon: Store, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    { title: "View Analytics", href: "/analytics", icon: BarChart3, color: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" },
  ]

  const stats = [
    { title: "Total Revenue", value: "15,240 FCFA", change: "+12.5%", icon: DollarSign, color: "text-green-600 dark:text-green-400", bgGradient: "from-green-500/10 to-emerald-500/5" },
    { title: "Active Orders", value: "8", change: "+2 this hour", icon: ShoppingBag, color: "text-red-600 dark:text-red-400", bgGradient: "from-red-500/10 to-rose-500/5" },
    { title: "Total Customers", value: "1,284", change: "+15 new", icon: Users, color: "text-blue-600 dark:text-blue-400", bgGradient: "from-blue-500/10 to-indigo-500/5" },
  ]

  return (
    <div className="space-y-8 py-2">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your restaurants today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Link href="/orders">View Orders</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all">
            <Link href="/onboarding">
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.change} <span className="text-gray-400 dark:text-gray-500">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-1">Latest transactions from all locations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" asChild>
                <Link href="/orders">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { id: "#2451", customer: "Amadou D.", items: "2x Burger Maison, 1x Coke", amount: "9,000 FCFA", status: "completed", time: "2 mins ago" },
                { id: "#2450", customer: "Fatou S.", items: "1x Yassa Poulet", amount: "3,500 FCFA", status: "processing", time: "15 mins ago" },
                { id: "#2449", customer: "Jean P.", items: "3x Pizza Margherita", amount: "12,000 FCFA", status: "pending", time: "1 hour ago" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-900/50 dark:hover:to-transparent transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform duration-200">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Order {order.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.items}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{order.amount}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {order.time}
                      </p>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}
                      className={
                        order.status === 'completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none shadow-sm" :
                          order.status === 'processing' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none shadow-sm" :
                            "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="shadow-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-900 dark:hover:to-transparent transition-all duration-200 group">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors flex-1">{action.title}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white border-none shadow-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            <CardContent className="relative p-6">
              <div className="mb-4 bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expand your business</h3>
              <p className="text-red-100 text-sm mb-5 leading-relaxed">Add a new location to your fleet and sync your inventory automatically.</p>
              <Button variant="secondary" size="sm" className="w-full bg-white text-red-600 hover:bg-red-50 border-none font-semibold shadow-md hover:shadow-lg transition-all" asChild>
                <Link href="/onboarding">Add Location</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

