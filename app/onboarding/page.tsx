"use client"

import { useState } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [chatbotEndpoint, setChatbotEndpoint] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [businessHours, setBusinessHours] = useState("")
  const [deliveryInfo, setDeliveryInfo] = useState("")
  const [location, setLocation] = useState("")
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome! Ask me about the menu, opening hours and delivery.")
  const [orderingEnabled, setOrderingEnabled] = useState(true)
  const [menuJson, setMenuJson] = useState(
    `[
  { "name": "Thieboudienne", "description": "Rice & fish", "price": 3500, "category": "Main" },
  { "name": "Yassa Poulet", "price": 3000, "category": "Main" }
]`
  )

  async function createRestaurant() {
    setCreating(true)
    try {
      // Try to parse menu JSON; if invalid, send empty and let user fix later
      let menu: any[] | undefined
      try {
        const parsed = JSON.parse(menuJson)
        if (Array.isArray(parsed)) menu = parsed
      } catch {
        // ignore parse error; menu remains undefined
      }

      const res = await fetch("/api/onboarding/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          cuisine,
          businessHours,
          deliveryInfo,
          location,
          welcomeMessage,
          orderingEnabled,
          menu,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to create restaurant")
      setChatbotEndpoint(String(data.chatbotEndpoint))
      setStep(2)
    } catch (e: any) {
      alert(e?.message || "Failed to create restaurant")
    } finally {
      setCreating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Onboarding</h1>
          <p className="text-muted-foreground">Create your restaurant and get a chatbot API endpoint.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className={step >= 1 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Name, description, hours, delivery, location</CardDescription>
            </CardHeader>
          </Card>
          <Card className={step >= 2 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Chatbot Endpoint</CardTitle>
              <CardDescription>Copy and use in your provider webhook</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>We’ll use this to personalize your assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chez Fatou" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Authentic Senegalese cuisine" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine (optional)</Label>
                <Input id="cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g. Senegalese, American" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Business Hours</Label>
                  <Input id="hours" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder="Mon-Sun 10:00-22:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery Info</Label>
                  <Input id="delivery" value={deliveryInfo} onChange={(e) => setDeliveryInfo(e.target.value)} placeholder="Deliveries 11:00-21:00 within 5km" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dakar, Point E" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome">Welcome Message</Label>
                <Textarea id="welcome" rows={2} value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <input id="ordering" type="checkbox" className="h-4 w-4" checked={orderingEnabled} onChange={(e) => setOrderingEnabled(e.target.checked)} />
                <Label htmlFor="ordering">Ordering enabled</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu">Menu (JSON array)</Label>
                <Textarea id="menu" rows={8} value={menuJson} onChange={(e) => setMenuJson(e.target.value)} />
                <p className="text-xs text-muted-foreground">Each item supports: name, description, price, category, isAvailable.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={createRestaurant} disabled={!name.trim() || creating}>{creating ? "Creating..." : "Create"}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-green-600">
            <CardHeader>
              <CardTitle className="text-green-700">Your Chatbot Endpoint</CardTitle>
              <CardDescription>Use this URL in your provider/webhook to POST messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded border p-3 bg-muted text-sm break-all select-all">{chatbotEndpoint}</div>
              <div className="text-xs text-muted-foreground">
                Expected body: {`{ "from": "<user>", "text": "<message>" }`}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
