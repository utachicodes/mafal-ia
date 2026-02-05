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
  Clock
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
    { title: "Total Revenue", value: "15,240 FCFA", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { title: "Active Orders", value: "8", change: "+2 this hour", icon: ShoppingBag, color: "text-red-600" },
    { title: "Total Customers", value: "1,284", change: "+15 new", icon: Users, color: "text-blue-600" },
  ]

  return (
    <div className="space-y-8 py-2">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your restaurant performance
            {userPlan === "PREMIUM" && (
              <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400 text-[10px] uppercase font-bold tracking-wider">
                Premium
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="sm" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
            <Link href="/orders">View Orders</Link>
          </Button>
          <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
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
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.change} <span className="text-gray-400 dark:text-gray-500">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</CardTitle>
                <CardDescription className="text-xs text-gray-500">Latest transactions from all locations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" asChild>
                <Link href="/orders">View All</Link>
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
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Order {order.id}</p>
                      <p className="text-xs text-gray-500">{order.items}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{order.amount}</p>
                      <p className="text-xs text-gray-400">{order.time}</p>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}
                      className={
                        order.status === 'completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none shadow-none" :
                          order.status === 'processing' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none shadow-none" :
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
          <Card className="shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-red-100 dark:hover:border-red-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{action.title}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-gray-400 group-hover:text-red-500" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Store className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">Expand your business</h3>
              <p className="text-red-100 text-sm mb-4">Add a new location to your fleet and sync your inventory automatically.</p>
              <Button variant="secondary" size="sm" className="w-full bg-white text-red-600 hover:bg-red-50 border-none font-semibold" asChild>
                <Link href="/onboarding">Add Location</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

