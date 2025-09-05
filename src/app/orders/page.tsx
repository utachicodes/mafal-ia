import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage customer orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>List of customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No orders found.</p>
        </CardContent>
      </Card>
    </div>
  )
}
