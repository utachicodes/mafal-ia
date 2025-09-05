"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle2, Phone } from "lucide-react"
import { type Restaurant, mockRestaurants } from "@/lib/data"
import { LocalStorage } from "@/src/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function WhatsAppQuickConnectPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored as Restaurant[])
      } else {
        setRestaurants(mockRestaurants)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])
  
  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, ...updates, updatedAt: new Date() } : restaurant,
      ),
    )
    // Save to local storage
    const updatedRestaurants = restaurants.map((restaurant) =>
      restaurant.id === id ? { ...restaurant, ...updates, updatedAt: new Date() } : restaurant
    )
    LocalStorage.saveRestaurants(updatedRestaurants)
  }

  const [selectedId, setSelectedId] = useState<string | undefined>("")
  const [phone, setPhone] = useState("")
  
  useEffect(() => {
    if (restaurants.length > 0 && !selectedId) {
      setSelectedId(restaurants[0]?.id)
    }
  }, [restaurants, selectedId])
  
  const restaurant = restaurants.find((r) => r.id === selectedId)

  const simulateGenerateQr = () => {
    toast({ title: "QR generated", description: "Scan with your test WhatsApp app to link." })
  }

  const simulateScan = () => {
    if (!selectedId) return
    if (!phone) {
      toast({ title: "Phone required", description: "Enter a WhatsApp number to link.", variant: "destructive" })
      return
    }
    updateRestaurant(selectedId, { whatsappConnected: true, whatsappNumber: phone })
    toast({ title: "Connected", description: `WhatsApp linked to ${phone}` })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Quick Connect</h1>
          <p className="text-muted-foreground">Dev-only simulator to link a WhatsApp number via QR</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Restaurant</CardTitle>
            <CardDescription>Select which assistant to connect</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Restaurant</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select a restaurant"} />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +5511999999999" />
                <Button variant="secondary" type="button" onClick={() => setPhone("+15551234567")}>
                  <Phone className="h-4 w-4"/>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use full international format with +country code.</p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                {restaurant?.whatsappConnected ? (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    <CheckCircle2 className="h-3 w-3 mr-1"/> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline">Not connected</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5"/> QR Code</CardTitle>
            <CardDescription>Generate a QR and simulate a scan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-48 h-48 border rounded grid place-content-center text-muted-foreground">
              <QrCode className="h-24 w-24"/>
            </div>
            <div className="flex gap-3">
              <Button onClick={simulateGenerateQr} type="button">Generate QR</Button>
              <Button variant="outline" onClick={simulateScan} type="button">Simulate Scan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
