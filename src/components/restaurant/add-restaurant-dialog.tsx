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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddRestaurantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AVAILABLE_LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"]

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
      id: Date.now().toString(),
      ...formData,
      isActive: false,
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
      },
    }

    addRestaurant(newRestaurant)
    onOpenChange(false)

    // Reset form
    setFormData({
      name: "",
      description: "",
      cuisine: "",
      whatsappNumber: "",
      supportedLanguages: ["English"],
    })
  }

  const addLanguage = (language: string) => {
    if (!formData.supportedLanguages.includes(language)) {
      setFormData((prev) => ({
        ...prev,
        supportedLanguages: [...prev.supportedLanguages, language],
      }))
    }
  }

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.filter((lang) => lang !== language),
    }))
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

          <div className="space-y-2">
            <Label>Supported Languages</Label>
            <Select onValueChange={addLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Add a language" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LANGUAGES.filter((lang) => !formData.supportedLanguages.includes(lang)).map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.supportedLanguages.map((language) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  {language !== "English" && (
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeLanguage(language)} />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
