"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhatsAppQRGenerator } from "@/src/components/whatsapp-qr-generator"
import { WhatsAppIntegrationStatus } from "@/src/components/whatsapp-integration-status"
import { ApiCredentials } from "@/src/components/restaurant/api-credentials"
import { GeneralSettings } from "@/src/components/restaurant/general-settings"
import { type Restaurant } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function WhatsAppSettingsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("")
  const [credentials, setCredentials] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants')
        const data = await res.json()
        setRestaurants(data as Restaurant[])
        if (data.length > 0) {
          setSelectedRestaurantId(data[0].id)
        }
      } catch (error) {
        console.error("Failed to load restaurants:", error)
        toast({
          title: "Error",
          description: "Failed to load restaurants",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadRestaurants()
  }, [toast])

  useEffect(() => {
    const loadCredentials = async () => {
      if (!selectedRestaurantId) return
      
      setIsLoadingCredentials(true)
      try {
        const res = await fetch(`/api/restaurants/${selectedRestaurantId}/credentials`)
        if (res.ok) {
          const data = await res.json()
          setCredentials(data)
        }
      } catch (error) {
        console.error("Failed to load credentials:", error)
      } finally {
        setIsLoadingCredentials(false)
      }
    }
    loadCredentials()
  }, [selectedRestaurantId])

  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!selectedRestaurant) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Restaurant Selected</h2>
          <p className="text-muted-foreground">Please select a restaurant to configure WhatsApp settings.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Integration</h1>
          <p className="text-muted-foreground">
            Configure WhatsApp Business API integration for {selectedRestaurant.name}
          </p>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <WhatsAppIntegrationStatus
              restaurantId={selectedRestaurant.id}
              phoneNumber={selectedRestaurant.whatsappNumber}
              phoneNumberId={credentials?.whatsappPhoneNumberId}
              accessToken={credentials?.whatsappAccessToken}
              appSecret={credentials?.whatsappAppSecret}
              verifyToken={credentials?.webhookVerifyToken}
              isActive={credentials?.isActive ?? selectedRestaurant.isActive}
            />
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <ApiCredentials restaurant={selectedRestaurant} />
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <WhatsAppQRGenerator
              phoneNumber={selectedRestaurant.whatsappNumber || ""}
              restaurantId={selectedRestaurant.id}
              onQRGenerated={(qrData) => {
                console.log("QR Code generated:", qrData)
                toast({
                  title: "QR Code Generated",
                  description: "Scan the QR code with WhatsApp to connect your number"
                })
              }}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>How to Use QR Code</CardTitle>
                <CardDescription>Steps to connect your WhatsApp number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Generate QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Generate QR Code" above to create a QR code for your WhatsApp number.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Open WhatsApp Web</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to web.whatsapp.com in your browser and log in to your WhatsApp account.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Scan QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your phone to scan the QR code displayed above.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">4. Test Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Send a test message to verify the connection is working.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <GeneralSettings restaurant={selectedRestaurant} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}