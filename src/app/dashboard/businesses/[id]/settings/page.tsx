import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Settings,
    ArrowLeft,
    Save,
    Trash2,
    Store,
    Clock,
    MapPin,
    Shield,
    Zap,
    Activity,
    Lock,
    Eye,
    ChevronRight,
    Globe,
    RefreshCw
} from "lucide-react"
import Link from "next/link"
import { BusinessService } from "@/src/lib/business-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

interface BusinessSettingsPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessSettingsPage({ params }: BusinessSettingsPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

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
                            Return to Business Hub
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gradient">
                            Core Configuration
                        </h1>
                        <div className="h-6 w-px bg-white/10 hidden md:block" />
                        <p className="text-muted-foreground text-lg hidden md:block">
                            Operational parameters for {restaurant.name}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest">
                        <Globe className="mr-2 h-4 w-4" />
                        Public Profile
                    </Button>
                    <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all font-bold gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Navigation Sidebar (Local) */}
                <div className="space-y-4">
                    {[
                        { icon: Store, label: "Identity & Branding", active: true },
                        { icon: MapPin, label: "Physical Location", active: false },
                        { icon: Clock, label: "Operating Grid", active: false },
                        { icon: Shield, label: "Security & Guarding", active: false },
                        { icon: Lock, label: "Privacy Protocols", active: false }
                    ].map((item, i) => (
                        <button key={i} className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                            item.active
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10"
                        )}>
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className={cn("h-4 w-4", item.active ? "opacity-100" : "opacity-0")} />
                        </button>
                    ))}
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="p-10 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                    <Store className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Identity Parameters</CardTitle>
                                    <CardDescription>Fundamental branding and categorization for the AI agent</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Business Public Name</label>
                                    <Input
                                        defaultValue={restaurant.name}
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 text-lg font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cuisine Logic Hub</label>
                                    <Input
                                        defaultValue={restaurant.cuisine}
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Description</label>
                                <Textarea
                                    defaultValue={restaurant.description || ""}
                                    placeholder="Describe your business for the AI grounding engine..."
                                    className="rounded-xl bg-white/5 border-white/10 focus:ring-primary/50 h-32 text-base leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <Activity className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Live Status Transmission</p>
                                        <p className="text-xs text-muted-foreground">Toggle visibility on the Mafal-IA discovery grid</p>
                                    </div>
                                </div>
                                <Button className={cn(
                                    "rounded-full px-6 border-2 font-black uppercase text-[10px] tracking-widest transition-all",
                                    restaurant.isActive
                                        ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                                        : "bg-white/5 text-muted-foreground border-white/10"
                                )}>
                                    {restaurant.isActive ? "Active Transmission" : "Offline Mode"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="glass border-destructive/20 rounded-[2.5rem] overflow-hidden bg-destructive/[0.02]">
                        <CardHeader className="p-10 pb-6 border-b border-destructive/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight text-destructive">System Termination</CardTitle>
                                    <CardDescription>Irreversible destructive actions regarding this branch</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <p className="font-bold text-lg">Retire Branch Infrastructure</p>
                                <p className="text-sm text-muted-foreground">All menu data, chat history, and AI models will be purged.</p>
                            </div>
                            <Button variant="destructive" className="rounded-xl px-6 h-12 shadow-xl shadow-destructive/20 font-bold gap-2">
                                <Trash2 className="h-4 w-4" />
                                Purge All Data
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Support Grid */}
            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-full bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Shield className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-2xl">Configuration Integrity</h4>
                        <p className="text-muted-foreground max-w-lg">Your operational data is encrypted and synced across all AI nodes in real-time. Changes may take up to 60s to propagate to live agents.</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl px-10 h-16 border-white/10 glass hover:bg-white/10 relative z-10 font-bold uppercase text-xs tracking-widest gap-3">
                    <RefreshCw className="h-4 w-4" />
                    Sync Node Grid
                </Button>
            </div>
        </div>
    )
}
