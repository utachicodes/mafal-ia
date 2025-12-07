import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPrisma } from "@/src/lib/db"
import { format } from "date-fns"
import { ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const prisma = await getPrisma()

  // Fetch orders with restaurant relation
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { restaurant: true },
    take: 50
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" /> Order History
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time feed of incoming orders from WhatsApp
        </p>
      </div>

      <Card className="glass-card overflow-hidden border-none shadow-xl">
        <CardHeader className="border-b bg-white/50 dark:bg-black/20">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 50 active transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No orders recorded yet.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b bg-muted/30">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Order ID</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Restaurant</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Customer</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Total</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0 bg-white/40 dark:bg-black/20 backdrop-blur-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b transition-colors hover:bg-primary/5">
                      <td className="p-6 align-middle font-mono text-xs text-muted-foreground">#{order.id.slice(-6)}</td>
                      <td className="p-6 align-middle">{format(order.createdAt, "MMM d, HH:mm")}</td>
                      <td className="p-6 align-middle font-semibold text-primary">{order.restaurant.name}</td>
                      <td className="p-6 align-middle">{order.phoneNumber}</td>
                      <td className="p-6 align-middle font-mono font-medium text-right">{order.total.toLocaleString()} FCFA</td>
                      <td className="p-6 align-middle text-center">
                        <Badge variant="secondary" className={
                          order.status === "confirmed" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                            order.status === "pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                              "bg-gray-100"
                        }>
                          {order.status}
                        </Badge>
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
