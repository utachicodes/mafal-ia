import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Store,
    Settings,
    UtensilsCrossed,
    MessageSquare,
    BarChart3,
    ArrowLeft,
    ShoppingBag,
    ExternalLink,
    ChevronRight,
    Shield,
    BookOpen
} from "lucide-react"
import Link from "next/link"
import { BusinessService } from "@/src/lib/business-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

interface RestaurantPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function RestaurantDashboardPage({ params }: RestaurantPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

    if (!restaurant) {
        notFound()
    }

    const orderCount = (restaurant as any).orders?.length || 0
    const menuItemCount = (restaurant as any).menu?.length || 0

    const sections = [
        {
            title: "Menu",
            description: "Add and manage your menu items",
            icon: UtensilsCrossed,
            href: `/dashboard/businesses/${id}/menu`,
        },
        {
            title: "Analytics",
            description: "View conversation and order statistics",
            icon: BarChart3,
            href: `/dashboard/businesses/${id}/analytics`,
        },
        {
            title: "WhatsApp",
            description: "Connect your WhatsApp Business account",
            icon: MessageSquare,
            href: `/dashboard/businesses/${id}/whatsapp`,
        },
        {
            title: "Knowledge Base",
            description: "Upload documents to enrich your chatbot",
            icon: BookOpen,
            href: `/dashboard/businesses/${id}/knowledge`,
        },
        {
            title: "Settings",
            description: "Configure your business profile and chatbot",
            icon: Settings,
            href: `/dashboard/businesses/${id}/settings`,
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-3 mb-1 text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/businesses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Businesses
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {restaurant?.name}
                        </h1>
                        <Badge
                            variant="outline"
                            className={cn(
                                "rounded-full text-xs font-medium",
                                restaurant?.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                    : "bg-muted text-muted-foreground border-border"
                            )}
                        >
                            {restaurant?.isActive ? "Online" : "Offline"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Store className="h-4 w-4" />
                        {restaurant?.cuisine}
                        <span>·</span>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
                            {id.slice(-8)}
                        </code>
                    </div>
                </div>

                <Button variant="outline" asChild className="rounded-lg h-9">
                    <Link href={`/dashboard/businesses/${id}/preview`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: "Total Orders", value: orderCount, icon: ShoppingBag },
                    { label: "Menu Items", value: menuItemCount, icon: UtensilsCrossed },
                    { label: "Uptime", value: "99.8%", icon: Shield }
                ].map((stat, i) => (
                    <Card key={i} className="border border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Management Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {sections.map((section) => (
                    <Link key={section.title} href={section.href} className="group">
                        <Card className="border border-border bg-card hover:border-primary/30 transition-colors h-full">
                            <CardHeader className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base font-semibold flex items-center gap-1">
                                            {section.title}
                                            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                                        </CardTitle>
                                        <CardDescription className="mt-0.5">
                                            {section.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
