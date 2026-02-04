"use client"

import type React from "react"

import { useState } from "react"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Key } from "lucide-react"

interface AddRestaurantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRestaurantDialog({ open, onOpenChange }: AddRestaurantDialogProps) {
  const { addRestaurant } = useRestaurants()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    whatsappNumber: "",
    supportedLanguages: ["English"] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRestaurant = {
      ...formData,
      isActive: false,
      isConcierge: false,
      menu: [],
      chatbotContext: {
        welcomeMessage: `Welcome to ${formData.name}! How can I help you today?`,
        businessHours: "9:00 AM - 10:00 PM",
        specialInstructions: "",
        orderingEnabled: true,
        deliveryInfo: "We offer delivery within 5km radius.",
      },
      apiCredentials: {
        whatsappAccessToken: "",
        whatsappPhoneNumberId: "",
        webhookVerifyToken: "",
        whatsappAppSecret: "",
      },
    }

    addRestaurant(newRestaurant)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cuisine: "",
      whatsappNumber: "",
      supportedLanguages: ["English"],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
          <DialogDescription>
            Create a new restaurant profile to start building your WhatsApp chatbot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter restaurant name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your restaurant"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Input
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData((prev) => ({ ...prev, cuisine: e.target.value }))}
              placeholder="e.g., Italian, Mexican, Asian"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="+1234567890"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Create Restaurant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
