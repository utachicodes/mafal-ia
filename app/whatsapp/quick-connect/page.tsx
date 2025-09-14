"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, CheckCircle2, Phone, Settings, ExternalLink, Copy, AlertCircle } from "lucide-react"
import { type Restaurant } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppConfig {
  accessToken: string
  appSecret: string
  phoneNumberId: string
  verifyToken: string
  webhookUrl: string
}

export default function WhatsAppQuickConnectPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [config, setConfig] = useState<WhatsAppConfig>({
    accessToken: "",
    appSecret: "",
    phoneNumberId: "",
    verifyToken: "mafal_verify_token_2024",
    webhookUrl: ""
  })
  const [isTesting, setIsTesting] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/restaurants')
        const data = await res.json()
        setRestaurants(data as Restaurant[])
        
        // Load current webhook URL
        const baseUrl = window.location.origin
        setConfig(prev => ({ ...prev, webhookUrl: `${baseUrl}/api/whatsapp` }))
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
        body: JSON.stringify(updates),
      })
    } catch {}
  }

  const [selectedId, setSelectedId] = useState<string | undefined>("")
  
  useEffect(() => {
    if (restaurants.length > 0 && !selectedId) {
      setSelectedId(restaurants[0]?.id)
    }
  }, [restaurants, selectedId])
  
  const restaurant = restaurants.find((r) => r.id === selectedId)

  const testConnection = async () => {
    if (!config.accessToken || !config.phoneNumberId) {
      toast({ 
        title: "Missing credentials", 
        description: "Please enter your access token and phone number ID.", 
        variant: "destructive" 
      })
      return
    }

    setIsTesting(true)
    try {
      const response = await fetch('/api/whatsapp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: config.accessToken,
          phoneNumberId: config.phoneNumberId
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        toast({ 
          title: "Connection successful!", 
          description: `Phone number verified: ${result.phoneNumber}` 
        })
        
        // Update restaurant with verified phone number ID
        if (selectedId) {
          await updateRestaurant(selectedId, { 
            whatsappPhoneNumberId: config.phoneNumberId,
            whatsappAccessToken: config.accessToken,
            whatsappAppSecret: config.appSecret,
            webhookVerifyToken: config.verifyToken
          })
        }
      } else {
        toast({ 
          title: "Connection failed", 
          description: result.error || "Failed to connect to WhatsApp API", 
          variant: "destructive" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to test connection", 
        variant: "destructive" 
      })
    } finally {
      setIsTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Webhook URL copied to clipboard" })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Business API Setup</h1>
          <p className="text-muted-foreground">Configure your restaurant's WhatsApp Business API integration with Meta</p>
        </div>

        {/* Meta API Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5"/>
              Meta WhatsApp Business API Credentials
            </CardTitle>
            <CardDescription>
              Get these from your Meta for Developers app at{" "}
              <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                developers.facebook.com
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="EAAxxxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appSecret">App Secret</Label>
                <Input
                  id="appSecret"
                  type="password"
                  value={config.appSecret}
                  onChange={(e) => setConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={config.phoneNumberId}
                  onChange={(e) => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="123456789012345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verifyToken">Verify Token</Label>
                <Input
                  id="verifyToken"
                  value={config.verifyToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, verifyToken: e.target.value }))}
                  placeholder="mafal_verify_token_2024"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={testConnection} disabled={isTesting || !config.accessToken || !config.phoneNumberId}>
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
              <Button variant="outline" onClick={() => window.open("https://developers.facebook.com/apps/", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2"/>
                Open Meta Developer Console
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Restaurant</CardTitle>
            <CardDescription>Select which restaurant to configure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {restaurant && (
              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="flex items-center gap-2">
                  {restaurant.whatsappPhoneNumberId ? (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1"/>
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <AlertCircle className="h-3 w-3 mr-1"/>
                      Not configured
                    </Badge>
                  )}
                </div>
                {restaurant.whatsappPhoneNumberId && (
                  <p className="text-sm text-muted-foreground">
                    Phone Number ID: {restaurant.whatsappPhoneNumberId}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5"/>
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Configure this URL in your Meta app's webhook settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  value={config.webhookUrl}
                  readOnly
                  className="bg-muted"
                />
                <Button variant="outline" onClick={() => copyToClipboard(config.webhookUrl)}>
                  <Copy className="h-4 w-4"/>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Verify Token</Label>
              <Input
                value={config.verifyToken}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Go to your Meta app's WhatsApp product settings</li>
                <li>In the Configuration section, set the webhook URL to: <code className="bg-blue-100 px-1 rounded">{config.webhookUrl}</code></li>
                <li>Set the verify token to: <code className="bg-blue-100 px-1 rounded">{config.verifyToken}</code></li>
                <li>Subscribe to the <code className="bg-blue-100 px-1 rounded">messages</code> field</li>
                <li>Click "Verify and Save"</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
