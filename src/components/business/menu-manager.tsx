"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Upload, Edit, Trash2, FileText } from "lucide-react"
import { useBusinesses } from "@/src/hooks/use-businesses"
import type { Business } from "@/lib/data"
import { createMenuItem, processMenuFromJSON, processMenuFromCSV, processMenuFromText, autoDetectMenuFromString, formatPrice } from "@/src/lib/data-utils"

interface MenuManagerProps {
  restaurant: Business
}

function AddMenuItemDialog({ restaurant }: { restaurant: Business }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const { updateRestaurant } = useBusinesses()
  const items = (restaurant as any).menu ?? (restaurant as any).menuItems ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && description.trim() && price) {
      const newItem = createMenuItem(name, description, Number(price), category || undefined)
      const updated = [...items, newItem]
      updateRestaurant(restaurant.id, { menu: updated })

      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>Add a new item to your restaurant menu</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Thieboudienne"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dish"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-price">Price (FCFA)</Label>
              <Input
                id="item-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3500"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-category">Category (Optional)</Label>
              <Input
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Main Course"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function UploadMenuDialog({ restaurant }: { restaurant: Business }) {
  const [open, setOpen] = useState(false)
  const [rawContent, setRawContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { updateRestaurant } = useBusinesses()
  const items = (restaurant as any).menu ?? (restaurant as any).menuItems ?? []

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newItems = autoDetectMenuFromString(rawContent)
      // Replace existing items with uploaded set
      updateRestaurant(restaurant.id, { menu: newItems })
      setRawContent("")
      setOpen(false)
    } catch (error) {
      alert("Error processing menu: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Menu (JSON / CSV / Text)</DialogTitle>
          <DialogDescription>
            Paste your menu in JSON, CSV, or simple one-item-per-line text. We auto-detect the format.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="menu-content">Menu Content</Label>
            <Textarea
              id="menu-content"
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder='JSON: [{"name":"Thieboudienne","price":3500}]\nCSV: name,description,price\nThieboudienne,Rice & fish,3500\nText: Thieboudienne - Rice & fish - 3500'
              rows={10}
              className="font-mono text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Upload Menu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function MenuManager({ restaurant }: MenuManagerProps) {
  const { updateRestaurant } = useBusinesses()
  const items = (restaurant as any).menu ?? (restaurant as any).menuItems ?? []

  const handleDeleteItem = (itemId: string) => {
    const updated = items.filter((item: any) => item.id !== itemId)
    updateRestaurant(restaurant.id, { menu: updated })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>Manage your restaurant's menu items</CardDescription>
            </div>
            <div className="flex gap-2">
              <UploadMenuDialog restaurant={restaurant} />
              <AddMenuItemDialog restaurant={restaurant} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
              <p className="text-muted-foreground mb-4">Add your first menu item or upload from JSON</p>
              <AddMenuItemDialog restaurant={restaurant} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>{item.category || "-"}</TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
