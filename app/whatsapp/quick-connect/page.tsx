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
import { type Restaurant } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { WhatsAppQRGenerator } from "@/src/components/whatsapp-qr-generator"

export default function WhatsAppQuickConnectPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/restaurants')
        const data = await res.json()
        setRestaurants(data as Restaurant[])
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])
  
  const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r)))
    try {
      await fetch(`/api/restaurants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber: updates.whatsappNumber }),
      })
    } catch {}
  }

  const [selectedId, setSelectedId] = useState<string | undefined>("")
  const [phone, setPhone] = useState("")
  
  useEffect(() => {
    if (restaurants.length > 0 && !selectedId) {
      setSelectedId(restaurants[0]?.id)
    }
  }, [restaurants, selectedId])
  
  const restaurant = restaurants.find((r) => r.id === selectedId)

  const handleQRGenerated = (qrData: string) => {
    console.log("QR Code generated with data:", qrData)
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

        <WhatsAppQRGenerator
          phoneNumber={phone}
          restaurantId={selectedId || ""}
          onQRGenerated={handleQRGenerated}
        />

        <Card>
          <CardHeader>
            <CardTitle>Test Connection</CardTitle>
            <CardDescription>Simulate a successful WhatsApp connection for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={simulateScan} type="button">
                Simulate Scan
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This simulates a successful WhatsApp connection for development testing.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
