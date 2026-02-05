import { ChatSimulator } from "@/src/components/chat-simulator"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { Sparkles, MessageSquare, ShieldCheck, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function PlaygroundPage() {
  const restaurants = await RestaurantService.getAllRestaurants()
  const simpleRestaurants = restaurants.map(r => ({ id: r.id, name: r.name }))

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Sandbox Environment
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient flex items-center gap-3">
            AI Playground
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Test your multilingual agents in a risk-free environment. Simulate customer interactions before deploying to WhatsApp.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 px-4 py-1 rounded-full font-bold">
            <Zap className="h-3 w-3 mr-2 animate-pulse" />
            Live Simulator
          </Badge>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Messages are persisted to DB</p>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="glass border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-xl">
        <div className="bg-primary/5 px-8 py-4 border-b border-primary/10 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500/50" />
          <div className="h-3 w-3 rounded-full bg-amber-500/50" />
          <div className="h-3 w-3 rounded-full bg-green-500/50" />
          <span className="ml-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Mafal-IA Simulation Engine v2.0</span>
        </div>
        <div className="p-2 md:p-8">
          <ChatSimulator restaurants={simpleRestaurants} />
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h3 className="font-bold">Natural Language</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">The simulator uses the same AI engine as the production WhatsApp bot.</p>
        </div>
        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col gap-3">
          <ShieldCheck className="h-6 w-6 text-green-500" />
          <h3 className="font-bold">Multi-tenant Isolation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Simulation data is isolated per restaurant to prevent data leakage.</p>
        </div>
        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col gap-3">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h3 className="font-bold">Smart RAG</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Tests your menu retrieval and price calculation logic in real-time.</p>
        </div>
      </div>
    </div>
  )
}

