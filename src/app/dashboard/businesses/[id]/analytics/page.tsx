import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    ArrowLeft,
    TrendingUp,
    MessageSquare,
    ShoppingBag,
    Clock,
    Download,
    Activity,
    BrainCircuit,
    Sparkles,
    Calendar,
    Filter,
    Zap
} from "lucide-react"
import Link from "next/link"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BusinessAnalyticsPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessAnalyticsPage({ params }: BusinessAnalyticsPageProps) {
    const { id } = await params
    const restaurant = await RestaurantService.getRestaurantById(id)

    if (!restaurant) {
        notFound()
    }

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <Button variant="ghost" asChild className="-ml-3 mb-2 text-muted-foreground hover:text-primary transition-colors group">
                        <Link href={`/dashboard/businesses/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Return to Hub
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gradient">
                            Agent Analytics
                        </h1>
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest px-3 py-1">
                            Telemetric Feed
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Operational intelligence for <span className="font-bold text-foreground">{restaurant.name}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="rounded-xl px-4 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Intelligence Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Conversations", value: "1,284", change: "+12.5%", icon: MessageSquare, color: "text-blue-500", trend: "up" },
                    { label: "Conversion Rate", value: "24.2%", change: "+4.3%", icon: Sparkles, color: "text-primary", trend: "up" },
                    { label: "Order Volume", value: "342", change: "+8.1%", icon: ShoppingBag, color: "text-emerald-500", trend: "up" },
                    { label: "AI Response %", value: "98.8%", change: "Stable", icon: BrainCircuit, color: "text-purple-500", trend: "neutral" }
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/10 overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className={cn("h-4 w-4 opacity-50 transition-transform group-hover:scale-110", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <TrendingUp className={cn("h-3 w-3", stat.trend === "up" ? "text-emerald-500" : "text-muted-foreground")} />
                                <span className={cn("text-[10px] font-bold uppercase", stat.trend === "up" ? "text-emerald-500" : "text-muted-foreground")}>
                                    {stat.change} vs v.prev
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Deep Insights Row */}
            <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-4 glass border-white/10 overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">Transmission Flow</CardTitle>
                                <CardDescription>Conversational payload over time</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl hover:bg-white/10">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[360px] flex flex-col items-center justify-center">
                        <div className="w-full flex items-end justify-between h-48 gap-3 px-4">
                            {[40, 60, 45, 90, 65, 80, 55, 70, 85, 40, 95, 75, 50, 65].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 border-t border-primary/30 rounded-t-lg relative group/bar"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] p-2 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        <span className="font-bold">{h * 12}</span> Units
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="w-full h-px bg-white/5 mt-8" />
                        <div className="w-full flex justify-between px-4 mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>01 Feb</span>
                            <span>07 Feb</span>
                            <span>14 Feb</span>
                            <span>21 Feb</span>
                            <span>Today</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 glass border-white/10 overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-bold tracking-tight">Intent Cluster</CardTitle>
                        <CardDescription>Customer intent mapping distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: "Order Initiation", value: 65, color: "bg-primary" },
                            { label: "Menu Inquiry", value: 48, color: "bg-blue-500" },
                            { label: "Location Routing", value: 32, color: "bg-emerald-500" },
                            { label: "Price Verification", value: 25, color: "bg-purple-500" },
                            { label: "Human Escalation", value: 12, color: "bg-orange-500" }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold flex items-center gap-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-full", item.color)} />
                                        {item.label}
                                    </span>
                                    <span className="text-muted-foreground font-mono">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                                        className={cn("h-full", item.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Diagnostic Footer */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-2xl">Telemetry Integrity</h4>
                        <p className="text-muted-foreground">All data is processed in real-time through the AI inference engine.</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl px-10 h-16 border-white/10 glass hover:bg-white/10 relative z-10 font-bold uppercase text-xs tracking-widest gap-3">
                    <Zap className="h-4 w-4 text-primary" />
                    Deep Audit
                </Button>
            </div>
        </div>
    )
}
