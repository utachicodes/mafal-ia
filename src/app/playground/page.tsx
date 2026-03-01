import { ChatSimulator } from "@/src/components/chat-simulator"
import { BusinessService } from "@/src/lib/business-service"
import { MessageSquare, ShieldCheck, Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PlaygroundPage() {
  const restaurants = await BusinessService.getAllBusinesses()
  const simpleRestaurants = restaurants.map(r => ({ id: r.id, name: r.name }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground mt-1">
          Test your chatbot with any business. Send messages and see how your customers will experience it.
        </p>
      </div>

      {/* Simulator Container */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/20" />
              <div className="h-3 w-3 rounded-full bg-amber-400/20" />
              <div className="h-3 w-3 rounded-full bg-emerald-400/20" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Chat Simulator</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
        <div className="p-0 md:p-4 min-h-[550px] flex flex-col">
          <ChatSimulator restaurants={simpleRestaurants} />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: MessageSquare,
            title: "Order Testing",
            desc: "Test how your chatbot handles orders, menu questions, and customer requests.",
          },
          {
            icon: ShieldCheck,
            title: "Data Isolation",
            desc: "Each business's data stays separate — customers only see their restaurant's menu.",
          },
          {
            icon: Search,
            title: "Menu Search",
            desc: "See how smart search finds items from your menu based on natural language queries.",
          }
        ].map((feature, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
