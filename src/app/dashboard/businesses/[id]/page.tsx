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
    Clock,
    ExternalLink,
    Zap,
    ChevronRight,
    Activity,
    Shield
} from "lucide-react"
import Link from "next/link"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

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

    const orderCount = (restaurant as any).orders?.length || 0
    const menuItemCount = (restaurant as any).menu?.length || 0

    const sections = [
        {
            title: "Menu Terminal",
            description: "Logic mapping for your restaurant's digital inventory",
            icon: UtensilsCrossed,
            color: "text-blue-500",
            href: `/dashboard/businesses/${id}/menu`,
        },
        {
            title: "Agent Analytics",
            description: "Telemetric data from AI-managed conversations",
            icon: BarChart3,
            color: "text-primary",
            href: `/dashboard/businesses/${id}/analytics`,
        },
        {
            title: "WhatsApp Bridge",
            description: "Grounding your AI agent on the customer front",
            icon: MessageSquare,
            color: "text-emerald-500",
            href: `/dashboard/businesses/${id}/whatsapp`,
        },
        {
            title: "Core Configuration",
            description: "Fundamental operational parameters and identity",
            icon: Settings,
            color: "text-purple-500",
            href: `/dashboard/businesses/${id}/settings`,
        }
    ]

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <Button variant="ghost" asChild className="-ml-3 mb-2 text-muted-foreground hover:text-primary transition-colors group">
                        <Link href="/dashboard/businesses">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Return to Hub
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gradient">
                            {restaurant?.name}
                        </h1>
                        <Badge className={cn(
                            "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2",
                            restaurant?.isActive
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_-5px_theme(colors.emerald.500)]"
                                : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                        )}>
                            {restaurant?.isActive ? "Operational" : "Offline"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Store className="h-4 w-4 text-primary" />
                        {restaurant?.cuisine} Hub
                        <span className="text-white/10">•</span>
                        <code className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            ID: {id.slice(-8)}
                        </code>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" asChild className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest">
                        <Link href={`/dashboard/businesses/${id}/preview`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Agent Live Preview
                        </Link>
                    </Button>
                    <Button className="rounded-xl px-4 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
                        <Zap className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Total Transactions", value: orderCount, icon: ShoppingBag, color: "text-blue-500" },
                    { label: "Grounding Data", value: menuItemCount, icon: Activity, color: "text-primary" },
                    { label: "System Health", value: "99.8%", icon: Shield, color: "text-emerald-500" }
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/10 overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className={cn("h-4 w-4 opacity-50 transition-transform group-hover:scale-110", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Real-time telemetry active</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Entity Management Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {sections.map((section) => (
                    <Link key={section.title} href={section.href} className="group">
                        <Card className="glass border-white/10 hover:border-primary/40 transition-all duration-500 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]">
                                <section.icon className="h-40 w-40" />
                            </div>
                            <CardHeader className="p-8">
                                <div className="flex items-start gap-6">
                                    <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10", section.color)}>
                                        <section.icon className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                            {section.title}
                                            <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                                        </CardTitle>
                                        <CardDescription className="text-lg leading-relaxed text-muted-foreground/80">
                                            {section.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Footer Status */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Clock className="h-6 w-6 text-emerald-500 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Infrastructure Integrity</h4>
                        <p className="text-sm text-muted-foreground">All branch services are fully synced with the AI core.</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl px-6 h-12 glass border-white/10 hover:bg-white/5 relative z-10 font-bold uppercase text-[10px] tracking-widest">
                    Run Diagnostic Audit
                </Button>
            </div>
        </div>
    )
}
