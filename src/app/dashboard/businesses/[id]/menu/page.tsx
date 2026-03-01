"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  ChefHat,
  ShoppingBag,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MenuItem = {
  id: string
  name: string
  price: number
  description?: string
  category?: string | null
  isAvailable: boolean
}

export default function RestaurantMenuPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const businessId = useMemo(() => String(params?.id || ""), [params])

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    isAvailable: true as boolean,
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    isAvailable: true as boolean,
  })

  async function load() {
    if (!businessId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/businesses/${businessId}/menu`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to load menu")
      setItems(data.items || [])
    } catch (e: any) {
      setError(e?.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [businessId])

  const filteredItems = useMemo(() => {
    return items.filter(it =>
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    )
  }, [items, searchQuery])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!businessId) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim() || undefined,
        isAvailable: Boolean(form.isAvailable),
      }
      const res = await fetch(`/api/businesses/${businessId}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to create item")
      setForm({ name: "", price: "", description: "", category: "", isAvailable: true })
      setIsAdding(false)
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to create item")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      price: String(item.price),
      description: item.description || "",
      category: item.category || "",
      isAvailable: item.isAvailable,
    })
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!businessId || !editingId) return
    setLoading(true)
    setError(null)
    try {
      const payload: any = {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        description: editForm.description.trim(),
        category: editForm.category.trim() || null,
        isAvailable: Boolean(editForm.isAvailable),
      }

      const res = await fetch(`/api/businesses/${businessId}/menu/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to update item")
      setEditingId(null)
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to update item")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this menu item?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/businesses/${businessId}/menu/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Deletion failed")
      await load()
    } catch (e: any) {
      setError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleAvailability(it: MenuItem) {
    setLoading(true)
    try {
      const res = await fetch(`/api/businesses/${businessId}/menu/${it.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !it.isAvailable }),
      })
      if (!res.ok) throw new Error("Update failed")
      await load()
    } catch (e: any) {
      setError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="-ml-3 mb-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Menu</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items and categories</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAdding ? "Cancel" : "Add Item"}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-border bg-card">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ChefHat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">New Menu Item</CardTitle>
                  <CardDescription>Add a new item to your menu</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Item Name</label>
                    <Input
                      placeholder="e.g. Signature Burger"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="h-10 rounded-lg bg-muted border-border"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Price (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="3500"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="h-10 rounded-lg bg-muted border-border"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g. Mains"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="h-10 rounded-lg bg-muted border-border"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Textarea
                      placeholder="Describe ingredients and flavor..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="rounded-lg bg-muted border-border h-20 resize-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground rounded-lg" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Item"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card className="border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total Items</span>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-semibold">{items.length}</div>
          </Card>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted border-border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1">
          <Card className="border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                    <th className="px-4 py-3 text-xs font-medium">Item</th>
                    <th className="px-4 py-3 text-xs font-medium">Price</th>
                    <th className="px-4 py-3 text-xs font-medium">Category</th>
                    <th className="px-4 py-3 text-xs font-medium">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {filteredItems.map((it, idx) => (
                      <motion.tr
                        key={it.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium text-foreground">{it.name}</span>
                            <span className="block text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{it.description || "No description"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold tabular-nums">{new Intl.NumberFormat().format(it.price)}</span>
                          <span className="text-xs text-muted-foreground ml-1">FCFA</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="rounded-md text-xs">
                            {it.category || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleAvailability(it)}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors",
                              it.isAvailable
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {it.isAvailable ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            {it.isAvailable ? "Visible" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(it)} className="h-8 w-8 rounded-lg">
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(it.id)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                <div className="p-12 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No items found.</p>
                  {searchQuery && (
                    <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary text-sm mt-1">
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card className="border border-border bg-card shadow-lg">
                <div className="flex justify-between items-center p-5 border-b border-border">
                  <div>
                    <h2 className="text-lg font-semibold">Edit Item</h2>
                    <p className="text-sm text-muted-foreground">{editForm.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="h-8 w-8 rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={onSaveEdit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <Input
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="h-10 bg-muted border-border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Price (FCFA)</label>
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                        className="h-10 bg-muted border-border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <Input
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="h-10 bg-muted border-border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Availability</label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditForm({ ...editForm, isAvailable: !editForm.isAvailable })}
                        className={cn(
                          "w-full h-10 rounded-lg font-medium",
                          editForm.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {editForm.isAvailable ? "Available" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Textarea
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="bg-muted border-border rounded-lg h-24 resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-10 rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
