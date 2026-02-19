import { ChatSimulator } from "@/src/components/chat-simulator"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { MessageSquare, ShieldCheck, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function PlaygroundPage() {
  const restaurants = await RestaurantService.getAllRestaurants()
  const simpleRestaurants = restaurants.map(r => ({ id: r.id, name: r.name }))

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Playground
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Test your chatbot with any business. Send messages and see exactly how your customers will experience it.
          </p>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div className="relative glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-background/40 backdrop-blur-3xl">
          <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
              </div>
              <div className="h-5 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chat Simulator</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black tracking-widest px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </div>
            </div>
          </div>
          <div className="p-0 md:p-6 min-h-[650px] flex flex-col">
            <ChatSimulator restaurants={simpleRestaurants} />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {[
          {
            icon: MessageSquare,
            title: "Order Testing",
            desc: "Test how your chatbot handles orders, menu questions, and customer requests.",
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            icon: ShieldCheck,
            title: "Data Isolation",
            desc: "Each business's data stays completely separate — your customers only see their restaurant's menu.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Search,
            title: "Menu Search",
            desc: "See how the smart search finds items from your menu based on natural language queries.",
            color: "text-muted-foreground",
            bg: "bg-white/5",
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
              <h3 className="text-2xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
