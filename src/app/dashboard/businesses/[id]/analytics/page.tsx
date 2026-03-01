import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    ArrowLeft,
    TrendingUp,
    MessageSquare,
    ShoppingBag,
    Download,
    Activity,
    Calendar,
} from "lucide-react"
import Link from "next/link"
import { BusinessService } from "@/src/lib/business-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

interface BusinessAnalyticsPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessAnalyticsPage({ params }: BusinessAnalyticsPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

    if (!restaurant) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-3 mb-1 text-muted-foreground hover:text-foreground">
                        <Link href={`/dashboard/businesses/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        Performance overview for <span className="font-medium text-foreground">{restaurant.name}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-lg h-9">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Conversations", value: "1,284", change: "+12.5%", icon: MessageSquare, up: true },
                    { label: "Conversion Rate", value: "24.2%", change: "+4.3%", icon: TrendingUp, up: true },
                    { label: "Order Volume", value: "342", change: "+8.1%", icon: ShoppingBag, up: true },
                    { label: "Response Rate", value: "98.8%", change: "Stable", icon: Activity, up: false }
                ].map((stat, i) => (
                    <Card key={i} className="border border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <TrendingUp className={cn("h-3 w-3", stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")} />
                                <span className={cn("text-xs", stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                                    {stat.change}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4 border border-border bg-card overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Message Volume</CardTitle>
                        <CardDescription>Conversations over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col items-center justify-center border-t border-border bg-muted/30">
                        <div className="w-full flex items-end justify-between h-40 gap-2 px-4">
                            {[40, 60, 45, 90, 65, 80, 55, 70, 85, 40, 95, 75, 50, 65].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                        <div className="w-full border-t border-border mt-4 pt-3 flex justify-between px-4 text-xs text-muted-foreground">
                            <span>01 Feb</span>
                            <span>07 Feb</span>
                            <span>14 Feb</span>
                            <span>21 Feb</span>
                            <span>Today</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border border-border bg-card overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Customer Intents</CardTitle>
                        <CardDescription>What customers are asking about</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Order Initiation", value: 65, color: "bg-primary" },
                            { label: "Menu Inquiry", value: 48, color: "bg-primary/60" },
                            { label: "Location & Hours", value: 32, color: "bg-emerald-500" },
                            { label: "Price Questions", value: 25, color: "bg-primary/30" },
                            { label: "Support Requests", value: 12, color: "bg-orange-500" }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-xs text-muted-foreground">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", item.color)}
                                        style={{ width: `${item.value}%` }}
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
