"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/src/components/dashboard-layout"
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

const STATUSES: Order["status"][] = ["pending", "confirmed", "preparing", "delivered", "cancelled"]

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/${id}`, { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      setOrder(await res.json())
    } catch (e: any) {
      setError(e?.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const setStatus = async (status: Order["status"]) => {
    if (!order) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(await res.text())
      await load()
    } catch (e) {
      alert((e as any)?.message || "Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  const variants = (s: Order["status"]) => (s === "delivered" ? "default" : s === "cancelled" ? "destructive" : "secondary") as any

  const title = useMemo(() => (order ? `Order #${order.id.slice(0, 6)}` : "Order"), [order])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{order ? new Date(order.createdAt).toLocaleString() : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild>
              <Link href="/orders">Back to Orders</Link>
            </Button>
            <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
          </div>
        </div>

        {error ? (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription className="text-destructive">{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Customer and status</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-medium">{order?.customerName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="font-medium">{order?.phoneNumber}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="flex gap-2 items-center">
                <Badge variant={order ? variants(order.status) : "secondary"}>{order?.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Ordered items with specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price (CFA)</TableHead>
                    <TableHead>Specifications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{it.itemName}</TableCell>
                      <TableCell>{it.quantity}</TableCell>
                      <TableCell>{it.price}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {it.specs ? Object.entries(it.specs).map(([k, v]) => `${k}: ${String(v)}`).join(", ") : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4 text-sm">
              <div className="font-semibold">Total: {order?.total} CFA</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Update order status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Button key={s} variant={order?.status === s ? "default" : "outline"} onClick={() => setStatus(s)} disabled={saving || !order || order.status === s}>
                {s}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
