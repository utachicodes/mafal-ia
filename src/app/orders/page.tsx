import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPrisma } from "@/src/lib/db"
import { format } from "date-fns"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View recent customer orders (Real-time from Database)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 50 orders across all restaurants</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No orders found yet.</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Order ID</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Restaurant</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Customer</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-mono text-xs">{order.id.slice(-6)}</td>
                      <td className="p-4 align-middle">{format(order.createdAt, "MMM d, HH:mm")}</td>
                      <td className="p-4 align-middle font-medium">{order.restaurant.name}</td>
                      <td className="p-4 align-middle">{order.phoneNumber}</td>
                      <td className="p-4 align-middle">{order.total} FCFA</td>
                      <td className="p-4 align-middle">
                        <Badge variant={order.status === "confirmed" ? "default" : "secondary"}>
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
