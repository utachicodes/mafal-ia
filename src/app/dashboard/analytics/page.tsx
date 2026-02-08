import { AnalyticsService } from "@/src/lib/analytics-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Store,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Download,
  Calendar
} from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  const data = await AnalyticsService.getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `${new Intl.NumberFormat().format(data.totalRevenue)} FCFA`,
      change: "All time earnings",
      icon: CreditCard,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Active Businesses",
      value: data.activeRestaurants.toString(),
      change: "Currently active",
      icon: Store,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Total Orders",
      value: new Intl.NumberFormat().format(data.totalOrders),
      change: "All time orders",
      icon: ShoppingBag,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Customer Conversations",
      value: new Intl.NumberFormat().format(data.conversationCount),
      change: "Recorded chats",
      icon: MessageSquare,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/20"
    }
  ]

  return (
    <div className="space-y-8 py-2 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of your platform's performance and growth.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm" className="h-9 gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg} transition-colors group-hover:scale-105 duration-200`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">{stat.change}</span>
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
            <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">Chart visualization enabled in production</p>
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
                { region: "Dakar", percentage: 65, color: "bg-red-500" },
                { region: "Abidjan", percentage: 20, color: "bg-blue-500" },
                { region: "Banjul", percentage: 10, color: "bg-amber-500" },
                { region: "Other", percentage: 5, color: "bg-gray-500" },
              ].map((item) => (
                <div key={item.region} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.region}
                    </span>
                    <span className="text-gray-500">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
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
