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
  TrendingUp,
  Users,
  CreditCard,
  Download,
  Calendar
} from "lucide-react"

export default function AnalyticsPage() {
  const { data: session } = useSession()

  const stats = [
    {
      title: "Total Revenue",
      value: "2.4M FCFA",
      change: "+8.2% from last month",
      icon: CreditCard,
    },
    {
      title: "Active Restaurants",
      value: "12",
      change: "+2 new this month",
      icon: Store,
    },
    {
      title: "Total Orders",
      value: "1,208",
      change: "+15% from last month",
      icon: ShoppingBag,
    },
    {
      title: "Customer Conversations",
      value: "8,542",
      change: "+24% from last month",
      icon: MessageSquare,
    }
  ]

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your platform's performance and growth.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">Chart visualization placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Regional Distribution</CardTitle>
            <CardDescription>
              Orders by location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "Dakar", percentage: 65 },
                { region: "Abidjan", percentage: 20 },
                { region: "Banjul", percentage: 10 },
                { region: "Other", percentage: 5 },
              ].map((item) => (
                <div key={item.region} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.region}</span>
                    <span className="text-gray-500">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.percentage}%` }}
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
