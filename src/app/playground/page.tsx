import { ChatSimulator } from "@/src/components/chat-simulator"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { Sparkles, MessageSquare, ShieldCheck, Zap, Bot, Terminal, Activity, BrainCircuit, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const dynamic = "force-dynamic"

export default async function PlaygroundPage() {
  const restaurants = await RestaurantService.getAllRestaurants()
  const simpleRestaurants = restaurants.map(r => ({ id: r.id, name: r.name }))

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest px-3 py-1">
              Neural Sandbox
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Global Playground
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Universal testing environment for the <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">Mafal-IA Grid</span>.
            Cross-restaurant inference and protocol verification.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest">
            <Activity className="mr-2 h-4 w-4" />
            Node Status
          </Button>
          <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all font-bold gap-2">
            <Zap className="h-4 w-4" />
            Initialize Engines
          </Button>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div className="relative glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-background/40 backdrop-blur-3xl">
          <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]" />
                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
              </div>
              <div className="h-5 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inference Kernel v2.0-STABLE</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black tracking-widest px-2 py-0.5 animate-pulse">
                ONLINE
              </Badge>
            </div>
          </div>
          <div className="p-0 md:p-6 min-h-[650px] flex flex-col">
            <ChatSimulator restaurants={simpleRestaurants} />
          </div>
        </div>
      </div>

      {/* Diagnostic Matrix */}
      <div className="grid gap-8 md:grid-cols-3">
        {[
          {
            icon: MessageSquare,
            title: "Logic Verification",
            desc: "Test complex ordering logic, price overrides, and dynamic menu weighting.",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            tag: "CORE"
          },
          {
            icon: ShieldCheck,
            title: "RLS Validation",
            desc: "Ensure data isolation protocols strictly separate tenant payload and AI memory.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            tag: "SECURITY"
          },
          {
            icon: Sparkles,
            title: "Smart RAG",
            desc: "Fine-tune vector retrieval parameters and semantic matching thresholds.",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            tag: "AI"
          }
        ].map((feature, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] glass border-white/10 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <feature.icon className="h-32 w-32" />
            </div>
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 mb-8", feature.bg, feature.color, "border-white/5 shadow-inner")}>
              <feature.icon className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <span className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/60">{feature.tag}</span>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {feature.title}
                <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all text-primary" />
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Transmission Bar */}
      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-8 w-8 text-primary animate-float" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xl text-white tracking-tight">Agent Integrity Check</h4>
            <p className="text-sm text-muted-foreground">Synchronize all active branches with the latest global inference protocol.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl px-10 h-16 border-white/10 glass hover:bg-white/10 relative z-10 font-bold uppercase text-xs tracking-widest gap-3 shadow-xl">
          <Activity className="h-4 w-4" />
          Broadcast Sync
        </Button>
      </div>
    </div>
  )
}

