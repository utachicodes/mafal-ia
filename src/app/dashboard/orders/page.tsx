import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderService } from "@/src/lib/order-service"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

interface Order {
  id: string
  phoneNumber: string
  business: { name: string } | null
  total: number
  status: string
  createdAt: Date
}

export default async function OrdersPage() {
  let orders: Order[] = []
  try {
    orders = (await OrderService.getAllOrders()) as unknown as Order[]
  } catch (e: any) {
    console.error("Failed to load orders:", e)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage incoming customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID or customer..."
              className="pl-9 h-9 bg-muted border-border rounded-lg"
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {orders.length} orders
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-14 w-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                Orders placed via WhatsApp will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium">Business</th>
                    <th className="px-4 py-3 text-right text-xs font-medium">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-sm">{order.phoneNumber}</span>
                            <span className="block text-xs text-muted-foreground">WhatsApp</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground text-sm">{order.business?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {new Intl.NumberFormat().format(order.total)}
                        <span className="text-xs text-muted-foreground ml-1">FCFA</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full text-xs font-medium capitalize",
                            order.status === 'completed'
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                              : order.status === 'processing'
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                                : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}{", "}{new Date(order.createdAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
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
