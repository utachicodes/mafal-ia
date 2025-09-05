"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  restaurantId: string
  restaurant?: { id: string; name: string }
  customerName: string
  phoneNumber: string
  items: { itemName: string; quantity: number; price: number; specs?: any }[]
  total: number
  notes?: string | null
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled"
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setOrders(data)
    } catch (e: any) {
      setError(e?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const totalCFA = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])

  const seed = async () => {
    setSeeding(true)
    try {
      // Try to pick a restaurant from an existing order or fallback to first via API
      const restaurantId = orders[0]?.restaurantId || (await guessRestaurantId())
      if (!restaurantId) throw new Error("No restaurant found to attach order")

      const body = {
        restaurantId,
        customerName: "John Doe",
        phoneNumber: "+15551234567",
        items: [
          { itemName: "Thieboudienne", quantity: 2, price: 3500, specs: { spicy: "medium" } },
          { itemName: "Yassa Poulet", quantity: 1, price: 2800, specs: { side: "extra onions" } },
        ],
        notes: "Deliver ASAP",
      }
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      await load()
    } catch (e) {
      console.error(e)
      alert((e as any)?.message || "Failed to seed order")
    } finally {
      setSeeding(false)
    }
  }

  const guessRestaurantId = async (): Promise<string | undefined> => {
    try {
      // Fallback: try to read one restaurant from existing REST endpoints if any
      const res = await fetch("/api/restaurants")
      if (!res.ok) return undefined
      const list = await res.json()
      return list?.[0]?.id
    } catch {
      return undefined
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Orders</h1>
            <p className="text-muted-foreground">All customer orders with item specifications</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
            <Button onClick={seed} disabled={seeding}>{seeding ? "Seeding..." : "Seed sample order"}</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders list</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : error ? <span className="text-destructive">{error}</span> : `${orders.length} orders • Total ${totalCFA} CFA`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total (CFA)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{o.customerName}</TableCell>
                      <TableCell>{o.phoneNumber}</TableCell>
                      <TableCell>{o.restaurant?.name || o.restaurantId}</TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {o.items.map((it, idx) => (
                            <div key={idx}>
                              {it.quantity}× {it.itemName}
                              {it.specs ? (
                                <span> — {Object.entries(it.specs).map(([k, v]) => `${k}: ${String(v)}`).join(", ")}</span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{o.total}</TableCell>
                      <TableCell>
                        <Badge variant={o.status === "delivered" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"}>{o.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No orders yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
