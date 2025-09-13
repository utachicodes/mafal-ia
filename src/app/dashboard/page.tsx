import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, MessageSquare, Utensils, Users, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Use the quick links below.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <span>View Reports</span>
            <BarChart3 className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/restaurants">
          <Card className="group transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>Manage your restaurants and menus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">Go to restaurants <ArrowRight className="ml-1 h-3 w-3" /></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/orders">
          <Card className="group transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and manage orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">Go to orders <ArrowRight className="ml-1 h-3 w-3" /></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analytics">
          <Card className="group transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Explore your analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">Go to analytics <ArrowRight className="ml-1 h-3 w-3" /></div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
