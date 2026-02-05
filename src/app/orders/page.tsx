import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPrisma } from "@/src/lib/db"
import { format } from "date-fns"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  User,
  Hash
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const prisma = await getPrisma()

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { restaurant: true },
    take: 50
  })

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient flex items-center gap-3">
            <ShoppingBag className="h-10 w-10 text-primary" /> Order History
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time feed of transactions processed by your AI agents.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/30 dark:bg-black/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Orders</CardTitle>
              <CardDescription>Latest 50 active transactions across all locations</CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-4 py-1">
              {orders.length} Orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground bg-muted/5">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-10" />
              <p className="text-xl font-medium">No orders recorded yet</p>
              <p className="text-sm">They will appear here once customers start ordering via WhatsApp.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    <th className="px-8 py-4 border-b border-white/5">Order ID</th>
                    <th className="px-6 py-4 border-b border-white/5">Restaurant</th>
                    <th className="px-6 py-4 border-b border-white/5">Customer</th>
                    <th className="px-6 py-4 border-b border-white/5">Phone Number</th>
                    <th className="px-6 py-4 border-b border-white/5 text-right">Total</th>
                    <th className="px-6 py-4 border-b border-white/5 text-center">Status</th>
                    <th className="px-8 py-4 border-b border-white/5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-5 font-mono text-xs font-bold text-primary">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold">
                            {order.restaurant?.name || "Unknown"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{order.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-base">
                        {new Intl.NumberFormat().format(order.total)} <span className="text-[10px] font-normal text-muted-foreground italic">FCFA</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-tighter font-black">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-right whitespace-nowrap">
                        <div className="text-xs font-bold text-foreground">
                          {format(order.createdAt, "MMM d, HH:mm")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
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
