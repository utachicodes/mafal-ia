"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import type { Restaurant } from "@/lib/data"

interface ApiCredentialsProps {
  restaurant: Restaurant
}

export function ApiCredentials({ restaurant }: ApiCredentialsProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [phoneId, setPhoneId] = useState(restaurant.apiCredentials.whatsappPhoneNumberId || "")
  const [savingPhoneId, setSavingPhoneId] = useState(false)
  const { regenerateApiKey, updateRestaurant } = useRestaurants()

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(restaurant.apiKey)
    // You could add a toast notification here
  }

  const handleRegenerateApiKey = async () => {
    setIsRegenerating(true)
    try {
      regenerateApiKey(restaurant.id)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsRegenerating(false)
    }
  }

  const maskedApiKey = restaurant.apiKey.replace(/(.{8}).*(.{8})/, "$1***$2")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>Use these credentials to integrate your restaurant's chatbot with WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={showApiKey ? restaurant.apiKey : maskedApiKey}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-id">Restaurant ID</Label>
            <div className="flex gap-2">
              <Input id="restaurant-id" value={restaurant.id} readOnly className="font-mono" />
              <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(restaurant.id)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wa-phone-id">WhatsApp phone_number_id</Label>
            <div className="flex gap-2">
              <Input
                id="wa-phone-id"
                placeholder="e.g. 123456789012345"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
              />
              <Button
                variant="default"
                onClick={async () => {
                  setSavingPhoneId(true)
                  try {
                    const res = await fetch(`/api/restaurants/${restaurant.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ apiCredentials: { whatsappPhoneNumberId: phoneId } }),
                    })
                    if (!res.ok) throw new Error("Failed to save phone_number_id")
                    // Update local state for immediate UI sync
                    updateRestaurant(restaurant.id, {
                      apiCredentials: { ...restaurant.apiCredentials, whatsappPhoneNumberId: phoneId },
                    })
                  } finally {
                    setSavingPhoneId(false)
                  }
                }}
                disabled={savingPhoneId}
              >
                {savingPhoneId ? "Saving..." : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Set this to your Meta WhatsApp <code>phone_number_id</code> so the webhook can route messages to this restaurant.
            </p>
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={handleRegenerateApiKey} disabled={isRegenerating}>
              {isRegenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate API Key
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Warning: Regenerating the API key will invalidate the current key and may break existing integrations.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Instructions</CardTitle>
          <CardDescription>How to connect your chatbot to WhatsApp Business API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Webhook URL</h4>
            <code className="block p-3 bg-muted rounded-md text-sm">https://your-domain.com/api/whatsapp</code>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Required Headers</h4>
            <code className="block p-3 bg-muted rounded-md text-sm">
              Authorization: Bearer {showApiKey ? restaurant.apiKey : maskedApiKey}
            </code>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Setup Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Configure your WhatsApp Business API webhook URL</li>
              <li>Add the API key to your webhook headers</li>
              <li>Test the integration using the Live View tab</li>
              <li>Deploy your chatbot to production</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
