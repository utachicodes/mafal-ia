"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit3,
  Check,
  X,
  ChefHat,
  ShoppingBag,
  ArrowLeft,
  Zap,
  Tag,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ChevronRight,
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
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Button variant="ghost" onClick={() => router.back()} className="-ml-3 mb-2 text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">Menu</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage your restaurant menu items and categories</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all gap-2"
        >
          {isAdding ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {isAdding ? "Cancel Entry" : "Register Item"}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="glass border-primary/30 shadow-2xl shadow-primary/5 p-8 rounded-[2.5rem]">
              <CardHeader className="p-0 mb-8 flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">New Menu Item</CardTitle>
                  <CardDescription>Add a new item to your menu</CardDescription>
                </div>
              </CardHeader>
              <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Item Name</label>
                  <Input
                    placeholder="e.g. Signature Truffle Burger"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Value (FCFA)</label>
                  <Input
                    type="number"
                    placeholder="3500"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                  <Input
                    placeholder="e.g. Mains"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                  <Textarea
                    placeholder="Describe ingredients, allergens, and flavor profiles..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="rounded-xl bg-white/5 border-white/10 focus:ring-primary/50 h-24"
                  />
                </div>
                <div className="flex items-end pb-1.5 px-4">
                  <Button type="submit" className="w-full h-12 bg-primary text-white rounded-xl shadow-lg font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add Item"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Stats */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="glass border-white/10 p-6 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Items</span>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div className="text-4xl font-black mb-1">{items.length}</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter italic">Items on the menu</p>
          </Card>

          <div className="p-6 glass border-white/10 rounded-[2rem] space-y-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground ml-1">Status</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-500/80">Chatbot Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1">
          <Card className="glass border-white/10 overflow-hidden rounded-[2.5rem] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                    <th className="px-8 py-5">Item</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {filteredItems.map((it, idx) => (
                      <motion.tr
                        key={it.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-lg text-foreground">{it.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{it.description || "No description"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-white/90">{new Intl.NumberFormat().format(it.price)} <span className="text-[10px] opacity-50">FCFA</span></span>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className="rounded-lg bg-white/5 border-white/5 text-[10px] uppercase font-bold px-2 py-0.5">
                            {it.category || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleAvailability(it)}
                            className={cn(
                              "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 transition-all",
                              it.isAvailable
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_-4px_theme(colors.emerald.500)]"
                                : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                            )}
                          >
                            {it.isAvailable ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            {it.isAvailable ? "Visible" : "Hidden"}
                          </motion.button>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(it)} className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(it.id)} className="h-9 w-9 rounded-xl hover:bg-destructive/20 hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                <div className="p-20 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                  <p className="text-muted-foreground font-bold italic uppercase tracking-widest text-xs">No items found.</p>
                  <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary font-black uppercase tracking-widest text-[10px]">Clear Search</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal (Portal-like Overlay) */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl"
            >
              <Card className="glass border-primary/20 shadow-2xl p-10 rounded-[3rem]">
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Item</h2>
                    <p className="text-muted-foreground text-lg">Updating: <span className="text-primary font-bold">{editForm.name}</span></p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="rounded-full h-12 w-12 hover:bg-white/10">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <form onSubmit={onSaveEdit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                      <Input
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (FCFA)</label>
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                      <Input
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl"
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-10">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Availability</label>
                      <Button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, isAvailable: !editForm.isAvailable })}
                        className={cn(
                          "flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest transition-all",
                          editForm.isAvailable
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20"
                            : "bg-white/5 text-muted-foreground border-white/10"
                        )}
                      >
                        {editForm.isAvailable ? "Available" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                    <Textarea
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="bg-white/5 border-white/10 rounded-2xl h-32 text-base leading-relaxed"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1 h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Commit Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-14 px-8 rounded-2xl border-white/10 font-bold glass">
                      Abort
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
