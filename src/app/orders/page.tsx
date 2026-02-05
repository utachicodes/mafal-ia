import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPrisma } from "@/src/lib/db"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Filter,
  ShoppingBag,
  User,
  Hash
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const prisma = await getPrisma()

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { restaurant: true },
    take: 50
  })

  return (
    <div className="space-y-12 py-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-pulse">
            <Hash className="h-3 w-3" /> Live Flow
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gradient flex items-center gap-4">
            Order History
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Monitor real-time transactions across your entire digital fleet.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold hover:bg-primary/5 transition-all duration-300 group">
            <Filter className="h-4 w-4 group-hover:rotate-12" />
            Filter Feed
          </Button>
          <Button className="rounded-2xl gap-2 font-black shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95">
            <ShoppingBag className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Card className="glass border-none shadow-3xl rounded-[32px] overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/40 dark:bg-black/20 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Recent Transactions</CardTitle>
              <CardDescription className="text-base">Latest 50 active orders from all integrated restaurants</CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-xl px-4 py-2 text-sm font-black bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/20">
              {orders.length} ACTIVE ORDERS
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-32 text-muted-foreground bg-muted/5">
              <div className="h-24 w-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-primary/5 text-primary/20">
                <ShoppingBag className="h-12 w-12 opacity-20" />
              </div>
              <p className="text-2xl font-bold">Your order feed is empty</p>
              <p className="text-sm font-medium mt-1">Connect your WhatsApp agents to start receiving real-time orders.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-white/30 dark:bg-black/10 text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">
                    <th className="px-10 py-6">ID</th>
                    <th className="px-8 py-6">Location</th>
                    <th className="px-8 py-6">Contact</th>
                    <th className="px-8 py-6 text-right">Value</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-primary/5 transition-all duration-300 group cursor-default">
                      <td className="px-10 py-6 font-mono text-xs font-black text-primary group-hover:pl-12 transition-all">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-black px-3 py-1 rounded-lg">
                          {order.restaurant?.name || "General"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <div className="font-bold flex items-center gap-2 group-hover:text-primary transition-colors hover:font-black cursor-pointer">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {order.phoneNumber}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium pl-5">Direct Reachout</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="font-black text-lg tracking-tighter tabular-nums group-hover:scale-110 transition-transform origin-right">
                          {new Intl.NumberFormat().format(order.total)}
                          <span className="ml-1 text-[10px] font-bold text-muted-foreground uppercase opacity-50">FCFA</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-black shadow-lg shadow-green-500/5">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-6 text-right whitespace-nowrap">
                        <div className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                          {format(order.createdAt, "MMM d, HH:mm")}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground opacity-60">
                          {format(order.createdAt, "yyyy")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
