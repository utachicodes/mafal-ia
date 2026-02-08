"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"

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
  const restaurantId = useMemo(() => String(params?.id || ""), [params])

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)

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
    if (!restaurantId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`, { cache: "no-store" })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!restaurantId) return
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
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to create item")
      setForm({ name: "", price: "", description: "", category: "", isAvailable: true })
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

  function cancelEdit() {
    setEditingId(null)
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!restaurantId || !editingId) return
    setLoading(true)
    setError(null)
    try {
      const payload: any = {}
      if (editForm.name.trim() !== "") payload.name = editForm.name.trim()
      if (editForm.price !== "") payload.price = Number(editForm.price)
      payload.description = editForm.description.trim()
      payload.category = editForm.category.trim() || null
      payload.isAvailable = Boolean(editForm.isAvailable)

      const res = await fetch(`/api/restaurants/${restaurantId}/menu/${editingId}`, {
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
    if (!restaurantId || !id) return
    if (!confirm("Delete this item?")) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to delete item")
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to delete item")
    } finally {
      setLoading(false)
    }
  }

  async function toggleAvailability(item: MenuItem) {
    await onQuickPatch(item.id, { isAvailable: !item.isAvailable })
  }

  async function onQuickPatch(id: string, patch: Record<string, any>) {
    if (!restaurantId || !id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to update")
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Menu</h1>
        <p className="text-sm text-muted-foreground">Add and manage your restaurant menu items. No WhatsApp setup required.</p>
      </header>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="rounded border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add item</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Name</span>
            <input className="rounded border px-3 py-2" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Price (FCFA)</span>
            <input className="rounded border px-3 py-2" required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm">Description</span>
            <textarea className="rounded border px-3 py-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Category</span>
            <input className="rounded border px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
            <span className="text-sm">Available</span>
          </label>
          <div className="sm:col-span-2">
            <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">Create</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Available</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>No items yet.</td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2 font-medium">{it.name}</td>
                  <td className="p-2">{new Intl.NumberFormat().format(it.price)} FCFA</td>
                  <td className="p-2">{it.category || "-"}</td>
                  <td className="p-2">{it.isAvailable ? "Yes" : "No"}</td>
                  <td className="p-2 text-right space-x-2">
                    <button onClick={() => toggleAvailability(it)} className="rounded border px-2 py-1">Toggle</button>
                    <button onClick={() => startEdit(it)} className="rounded border px-2 py-1">Edit</button>
                    <button onClick={() => onDelete(it.id)} className="rounded border px-2 py-1 text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingId && (
        <section className="rounded border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Edit item</h2>
          <form onSubmit={onSaveEdit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm">Name</span>
              <input className="rounded border px-3 py-2" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">Price (FCFA)</span>
              <input className="rounded border px-3 py-2" required type="number" min={0} value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm">Description</span>
              <textarea className="rounded border px-3 py-2" rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">Category</span>
              <input className="rounded border px-3 py-2" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editForm.isAvailable} onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })} />
              <span className="text-sm">Available</span>
            </label>
            <div className="sm:col-span-2 space-x-2">
              <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">Save</button>
              <button type="button" onClick={cancelEdit} className="rounded border px-4 py-2">Cancel</button>
            </div>
          </form>
        </section>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Working…</p>
      )}
    </main>
  )
}
