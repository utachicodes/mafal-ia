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
            description: "Manage your AI-powered menu items and categories",
            icon: UtensilsCrossed,
            href: `/restaurants/${id}/menu`,
            color: "text-orange-500 bg-orange-500/10"
        },
        {
            title: "Chat Analytics",
            description: "View how customers are interacting with your agent",
            icon: BarChart3,
            href: `/restaurants/${id}/analytics`,
            color: "text-blue-500 bg-blue-500/10"
        },
        {
            title: "WhatsApp Settings",
            description: "Configure your WhatsApp integration and auto-responses",
            icon: MessageSquare,
            href: `/restaurants/${id}/whatsapp`,
            color: "text-green-500 bg-green-500/10"
        },
        {
            title: "General Settings",
            description: "Basic restaurant info, location, and operating hours",
            icon: Settings,
            href: `/restaurants/${id}/settings`,
            color: "text-purple-500 bg-purple-500/10"
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-2 opacity-50 hover:opacity-100 mb-2">
                        <Link href="/restaurants">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Restaurants
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gradient">
                            {restaurant.name}
                        </h1>
                        <Badge variant="outline" className={restaurant.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-100"}>
                            {restaurant.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{restaurant.cuisine} Restaurant • {id.slice(-6).toUpperCase()}</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" asChild className="rounded-full">
                        <Link href={`/restaurants/${id}/preview`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview Agent
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass shadow-lg border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <ShoppingBag className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{orderCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass shadow-lg border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <UtensilsCrossed className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
                                <p className="text-2xl font-bold">{menuItemCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass shadow-lg border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-2xl">
                                <Clock className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <p className="text-2xl font-bold text-green-600">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Management Sections */}
            <div className="grid gap-6 md:grid-cols-2">
                {sections.map((section) => (
                    <Link key={section.title} href={section.href}>
                        <Card className="group glass card-hover overflow-hidden h-full border-none shadow-xl">
                            <CardHeader className="pb-4 border-none">
                                <div className="flex items-center justify-between">
                                    <div className={`p-4 rounded-2xl ${section.color} transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-lg`}>
                                        <section.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 border-none">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{section.title}</CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    {section.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
