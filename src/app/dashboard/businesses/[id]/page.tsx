import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    Clock,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { notFound } from "next/navigation"

interface RestaurantPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function RestaurantDashboardPage({ params }: RestaurantPageProps) {
    const { id } = await params
    const restaurant = await RestaurantService.getRestaurantById(id)

    if (!restaurant) {
        notFound()
    }

    // Safely check for relations, though RestaurantService might not include them by default
    const orderCount = (restaurant as any).orders?.length || 0
    const menuItemCount = (restaurant as any).menu?.length || 0

    const sections = [
        {
            title: "Menu Management",
            description: "Manage your menu items and categories",
            icon: UtensilsCrossed,
            href: `/dashboard/businesses/${id}/menu`,
        },
        {
            title: "Chat Analytics",
            description: "View how customers are interacting with your agent",
            icon: BarChart3,
            href: `/dashboard/businesses/${id}/analytics`,
        },
        {
            title: "WhatsApp Settings",
            description: "Configure your WhatsApp integration and auto-responses",
            icon: MessageSquare,
            href: `/dashboard/businesses/${id}/whatsapp`,
        },
        {
            title: "General Settings",
            description: "Basic restaurant info, location, and operating hours",
            icon: Settings,
            href: `/dashboard/businesses/${id}/settings`,
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-2 mb-2 text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/businesses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Businesses
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {restaurant.name}
                        </h1>
                        <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                            {restaurant.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Store className="mr-2 h-4 w-4" />
                        {restaurant.cuisine} Business
                        <span className="mx-2">•</span>
                        <span className="uppercase font-mono text-xs">{id.slice(-6)}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/businesses/${id}/preview`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview Agent
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{menuItemCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Active</div>
                    </CardContent>
                </Card>
            </div>

            {/* Management Sections */}
            <div className="grid gap-6 md:grid-cols-2">
                {sections.map((section) => (
                    <Link key={section.title} href={section.href}>
                        <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                        <CardDescription className="mt-1">
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
