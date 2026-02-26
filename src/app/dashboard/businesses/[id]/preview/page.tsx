import { ChatSimulator } from "@/src/components/chat-simulator"
import { BusinessService } from "@/src/lib/business-service"
import { Sparkles, MessageSquare, ShieldCheck, Zap, ArrowLeft, Terminal, Bot, Globe, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

interface PreviewPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessPreviewPage({ params }: PreviewPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

    if (!restaurant) {
        notFound()
    }

    const simpleRestaurants = [{ id: restaurant.id, name: restaurant.name }]

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
                            Neural Playground
                        </h1>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase text-[10px] tracking-widest px-3 py-1">
                            Live Inference
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Real-time simulation for <span className="font-bold text-foreground">{restaurant.name}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest">
                        <Terminal className="mr-2 h-4 w-4" />
                        Log Stream
                    </Button>
                    <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all font-bold gap-2">
                        <Sparkles className="h-4 w-4" />
                        Reset Session
                    </Button>
                </div>
            </div>

            {/* Simulator Container */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-background/50 backdrop-blur-3xl">
                    <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                            </div>
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mafal-IA Core v2.0.4</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sync Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-0 md:p-4 min-h-[600px] flex flex-col">
                        <ChatSimulator restaurants={simpleRestaurants} />
                    </div>
                </div>
            </div>

            {/* Feature Matrix */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    {
                        icon: Globe,
                        title: "Multilingual Grid",
                        desc: "Seamless translation between FR, EN, and AR with local dialect awareness.",
                        color: "text-primary",
                        bg: "bg-primary/10"
                    },
                    {
                        icon: ShieldCheck,
                        title: "Instruction Guard",
                        desc: "Strict RAG compliance ensures your agent never hallucinates or leaks internal data.",
                        color: "text-emerald-500",
                        bg: "bg-emerald-500/10"
                    },
                    {
                        icon: Zap,
                        title: "Flash Response",
                        desc: "Sub-100ms inference time for instant customer gratification across all devices.",
                        color: "text-primary",
                        bg: "bg-primary/10"
                    }
                ].map((feature, i) => (
                    <div key={i} className="p-8 rounded-[2rem] glass border-white/10 hover:border-primary/20 transition-all duration-500 group">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 mb-6", feature.bg, feature.color, "border-white/5")}>
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            {feature.title}
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Diagnostic Footer */}
            <div className="p-10 rounded-[3rem] premium-gradient flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-[2rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20">
                        <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-2xl text-white">System Diagnostics</h4>
                        <p className="text-white/70 max-w-lg">Everything looking correct? Deploy your configuration to the live WhatsApp grid to begin processing real customer payload.</p>
                    </div>
                </div>
                <Button className="rounded-2xl px-12 h-16 bg-white text-primary hover:bg-white/90 font-black uppercase text-xs tracking-widest shadow-2xl relative z-10 transition-all hover:scale-[1.02]">
                    Push to Production
                </Button>
            </div>
        </div>
    )
}
