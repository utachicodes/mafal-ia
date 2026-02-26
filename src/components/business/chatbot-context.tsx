"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { useBusinesses } from "@/src/hooks/use-businesses"
import type { Business } from "@/lib/data"

interface ChatbotContextProps {
  restaurant: Business
}

export function ChatbotContext({ restaurant }: ChatbotContextProps) {
  const [welcomeMessage, setWelcomeMessage] = useState(restaurant.chatbotContext?.welcomeMessage || "")
  const [businessHours, setBusinessHours] = useState(restaurant.chatbotContext?.businessHours || "")
  const [specialInstructions, setSpecialInstructions] = useState(
    restaurant.chatbotContext?.specialInstructions || "",
  )
  const [orderingEnabled, setOrderingEnabled] = useState(Boolean(restaurant.chatbotContext?.orderingEnabled))
  const [deliveryInfo, setDeliveryInfo] = useState(restaurant.chatbotContext?.deliveryInfo || "")
  const [isLoading, setIsLoading] = useState(false)
  const { updateRestaurant } = useBusinesses()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        chatbotContext: {
          welcomeMessage: welcomeMessage.trim(),
          businessHours: businessHours.trim(),
          specialInstructions: specialInstructions.trim(),
          orderingEnabled,
          deliveryInfo: deliveryInfo.trim(),
        },
      }

      // Persist to API for consistency
      await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      // Update local state for instant UI feedback
      updateRestaurant(restaurant.id, payload)
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges =
    welcomeMessage !== (restaurant.chatbotContext?.welcomeMessage || "") ||
    businessHours !== (restaurant.chatbotContext?.businessHours || "") ||
    specialInstructions !== (restaurant.chatbotContext?.specialInstructions || "") ||
    orderingEnabled !== Boolean(restaurant.chatbotContext?.orderingEnabled) ||
    deliveryInfo !== (restaurant.chatbotContext?.deliveryInfo || "")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Context</CardTitle>
        <CardDescription>
          Configure the context and operating details your WhatsApp chatbot should use when helping customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome">Welcome Message</Label>
            <Textarea
              id="welcome"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Greeting shown to customers"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours">Business Hours</Label>
              <Input
                id="hours"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="e.g., 11:00 AM - 10:00 PM daily"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="space-y-1">
                <Label htmlFor="ordering">Ordering Enabled</Label>
                <p className="text-xs text-muted-foreground">Allow customers to place orders via the chatbot</p>
              </div>
              <Switch id="ordering" checked={orderingEnabled} onCheckedChange={setOrderingEnabled} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special">Special Instructions</Label>
            <Textarea
              id="special"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="House rules, dietary notes, promos, etc."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Info</Label>
            <Textarea
              id="delivery"
              value={deliveryInfo}
              onChange={(e) => setDeliveryInfo(e.target.value)}
              placeholder="Delivery areas, fees, and conditions"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {welcomeMessage.length + businessHours.length + specialInstructions.length + deliveryInfo.length} characters
            </p>
            <Button type="submit" disabled={!hasChanges || isLoading} className="min-w-[100px]">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Context
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
