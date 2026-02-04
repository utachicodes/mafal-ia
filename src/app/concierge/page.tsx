"use client"

import { useMemo, useState, useEffect } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Restaurant, MenuItem } from "@/lib/data"
// import { mockRestaurants } from "@/lib/data" // Removed mock data usage
import { LocalStorage } from "@/src/lib/storage"
import { useToast } from "@/hooks/use-toast"

function normalizeMenu(r: any): MenuItem[] {
  // Support both schemas: r.menu (lib/data.ts) and r.menuItems (onboarding local)
  if (Array.isArray(r.menu) && r.menu.length) return r.menu as MenuItem[]
  if (Array.isArray(r.menuItems) && r.menuItems.length) {
    return (r.menuItems as any[]).map((m: any, idx) => ({
      id: String(m.id ?? idx + 1),
      name: String(m.name ?? "Item"),
      description: String(m.description ?? ""),
      price: Number(m.price ?? 0),
      category: m.category ? String(m.category) : undefined,
      isAvailable: m.isAvailable ?? true,
    }))
  }
  return []
}

export default function ConciergePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored as Restaurant[])
      } else {
        // setRestaurants(mockRestaurants) // Removed mock data usage
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  const [query, setQuery] = useState("")
  const [locationText, setLocationText] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedItems, setSelectedItems] = useState<{ item: MenuItem; qty: number }[]>([])
  const [placing, setPlacing] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as { restaurant: Restaurant; items: MenuItem[] }[]
    return restaurants
      .map((r) => ({ restaurant: r as any as Restaurant, items: normalizeMenu(r).filter((m) => (m.name + " " + (m.description || "") + " " + (m.category || "")).toLowerCase().includes(q) && (m.isAvailable ?? true)) }))
      .filter((entry) => entry.items.length > 0)
  }, [restaurants, query])

  const startOrder = (restaurant: Restaurant, items: MenuItem[]) => {
    setSelectedRestaurant(restaurant)
    // Default select top 1 matched item with qty 1
    setSelectedItems(items.slice(0, 1).map((i) => ({ item: i, qty: 1 })))
  }

  const updateQty = (idx: number, qty: number) => {
    setSelectedItems((prev) => prev.map((p, i) => (i === idx ? { ...p, qty: Math.max(0, Math.floor(qty || 0)) } : p)))
  }

  const addItem = (item: MenuItem) => {
    setSelectedItems((prev) => [...prev, { item, qty: 1 }])
  }

  const removeItem = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const total = useMemo(() => selectedItems.reduce((sum, it) => sum + (it.qty > 0 ? it.item.price * it.qty : 0), 0), [selectedItems])

  const placeOrder = async () => {
    if (!selectedRestaurant) return
    const orderItems = selectedItems.filter((s) => s.qty > 0).map((s) => ({ itemName: s.item.name, quantity: s.qty }))
    if (orderItems.length === 0) {
      toast({ title: "No items", description: "Add at least one item to order.", variant: "destructive" })
      return
    }
    setPlacing(true)
    try {
      const res = await fetch("/api/concierge/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          // No phone number in concierge UI; use a synthetic customer id for demo
          phoneNumber: "concierge_demo",
          itemsSummary: orderItems.map((i) => `${i.quantity}x ${i.itemName}`).join(", "),
          notFoundItems: "",
          orderItems,
          locationText,
          total,
        }),
      })
      if (!res.ok) throw new Error(`Order API failed: ${res.status}`)
      const data = await res.json()
      toast({ title: "Order placed!", description: `ID: ${data.id} • Total: ${total} FCFA` })
      setSelectedRestaurant(null)
      setSelectedItems([])
    } catch (e: any) {
      toast({ title: "Failed to place order", description: e.message || String(e), variant: "destructive" })
    } finally {
      setPlacing(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading restaurants…</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Concierge</h1>
            <p className="text-muted-foreground">Ask for what you want. We'll search all restaurants and help you order.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What are you craving?</CardTitle>
            <CardDescription>Describe your meal, e.g. "burgers", "spicy chicken", "vegan salad"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="q">What do you want</Label>
                <Input id="q" placeholder="e.g. burgers" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc">Your location (optional)</Label>
                <Input id="loc" placeholder="e.g. Plateau, Dakar" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
              </div>
            </div>
            {query.trim() && (
              <div className="text-sm text-muted-foreground">Found {results.length} restaurant(s) with matches.</div>
            )}
          </CardContent>
        </Card>

        {query.trim() && (
          <div className="grid md:grid-cols-2 gap-4">
            {results.map(({ restaurant, items }) => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{restaurant.name}</span>
                    <Button size="sm" variant="outline" onClick={() => startOrder(restaurant, items)}>Order here</Button>
                  </CardTitle>
                  <CardDescription>{restaurant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium mb-2">Matches</div>
                  <ul className="text-sm space-y-1">
                    {items.slice(0, 5).map((m) => (
                      <li key={m.id} className="flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="opacity-70">{m.price} FCFA</span>
                      </li>
                    ))}
                    {items.length > 5 && (
                      <li className="text-xs text-muted-foreground">+{items.length - 5} more</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedRestaurant && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Order from {selectedRestaurant.name}</CardTitle>
              <CardDescription>Adjust quantities and place your order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {selectedItems.map((si, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium">{si.item.name}</div>
                      <div className="text-xs text-muted-foreground">{si.item.price} FCFA</div>
                    </div>
                    <Input
                      className="w-20"
                      type="number"
                      min={0}
                      value={si.qty}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                    />
                    <Button variant="ghost" onClick={() => removeItem(idx)}>Remove</Button>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">Add another match:</div>
              <div className="flex flex-wrap gap-2">
                {normalizeMenu(selectedRestaurant).slice(0, 8).map((m) => (
                  <Button key={m.id} size="sm" variant="secondary" onClick={() => addItem(m)}>
                    + {m.name}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="font-semibold">Total: {total} FCFA</div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setSelectedRestaurant(null); setSelectedItems([]) }}>Cancel</Button>
                  <Button onClick={placeOrder} disabled={placing || total <= 0}>{placing ? "Placing…" : "Place Order"}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
