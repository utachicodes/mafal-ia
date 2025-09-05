import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Store, BarChart3, MessageSquare, Settings, Key, Utensils, Users, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

type StatCardProps = {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  trend?: string
  trendType?: 'up' | 'down'
}

const StatCard = ({ title, value, icon, description, trend, trendType = 'up' }: StatCardProps) => (
  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/20 dark:hover:shadow-primary/10">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`mt-2 flex items-center text-xs ${trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trendType === 'up' ? '↑' : '↓'} {trend} from last month
        </div>
      )}
    </CardContent>
  </Card>
)

const QuickAction = ({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) => (
  <Link href={href}>
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group cursor-pointer h-full">
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-medium text-center">{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Go to {title.toLowerCase()} <ArrowRight className="ml-1 h-3 w-3" />
      </div>
    </div>
  </Link>
)

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <span>View Reports</span>
            <BarChart3 className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Restaurants"
          value="12"
          icon={<Utensils className="h-4 w-4" />}
          description="+2 from last month"
          trend="12%"
        />
        <StatCard
          title="Active Orders"
          value="8"
          icon={<MessageSquare className="h-4 w-4" />}
          description="+3 from yesterday"
          trend="8%"
        />
        <StatCard
          title="Total Customers"
          value="1,234"
          icon={<Users className="h-4 w-4" />}
          description="+180 from last month"
          trend="12%"
        />
        <StatCard
          title="Avg. Response Time"
          value="2.4m"
          icon={<Clock className="h-4 w-4" />}
          description="-0.3m from last month"
          trend="8%"
          trendType="down"
        />
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View your business analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
