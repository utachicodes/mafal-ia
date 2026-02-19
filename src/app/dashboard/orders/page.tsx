import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderService } from "@/src/lib/order-service"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Filter,
  ShoppingBag,
  Download,
  Search,
  MoreHorizontal,
  User,
  MapPin,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

interface Order {
  id: string
  phoneNumber: string
  restaurant: { name: string } | null
  total: number
  status: string
  createdAt: Date
}

export default async function OrdersPage() {
  const orders = await OrderService.getAllOrders() as unknown as Order[]

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage incoming customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-4 h-11 border-white/10 glass hover:bg-white/5 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="glass border-white/10 overflow-hidden">
        <CardHeader className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search by ID or customer..."
              className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {orders.length} TOTAL
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-32 bg-white/[0.01]">
              <div className="h-20 w-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">No orders yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Orders placed via WhatsApp will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/5">
                  <tr>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px]">Order ID</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px]">Customer</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px]">Restaurant</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px] text-right">Total</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px] text-center">Status</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px] text-right">Date</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                          #{order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{order.phoneNumber}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                              WhatsApp
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{order.restaurant?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-foreground tabular-nums text-base">
                        {new Intl.NumberFormat().format(order.total)}
                        <span className="text-[10px] text-muted-foreground font-medium ml-1">FCFA</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge
                          className={cn(
                            "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2",
                            order.status === 'completed'
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_-5px_theme(colors.emerald.500)]"
                              : order.status === 'processing'
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_-5px_theme(colors.blue.500)]"
                                : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right text-muted-foreground group-hover:text-foreground whitespace-nowrap font-medium">
                        {format(order.createdAt, "MMM d, HH:mm")}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 transition-all opacity-40 group-hover:opacity-100">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-white/10">
                            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest px-4 py-2">Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg mx-1">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg mx-1">
                              Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5 mx-1 my-1" />
                            <DropdownMenuItem className="px-4 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer rounded-lg mx-1 font-bold">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
