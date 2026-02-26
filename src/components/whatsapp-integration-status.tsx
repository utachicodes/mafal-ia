"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppIntegrationStatusProps {
  businessId: string
  phoneNumber?: string
  phoneNumberId?: string
  accessToken?: string
  appSecret?: string
  verifyToken?: string
  isActive?: boolean
}

export function WhatsAppIntegrationStatus({
  businessId,
  phoneNumber,
  phoneNumberId,
  accessToken,
  appSecret,
  verifyToken,
  isActive = false
}: WhatsAppIntegrationStatusProps) {
  const [webhookStatus, setWebhookStatus] = useState<"unknown" | "verified" | "failed">("unknown")
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const { toast } = useToast()

  const webhookURL = typeof window !== "undefined" ? `${window.location.origin}/api/whatsapp` : "/api/whatsapp"

  const testWebhook = async () => {
    setIsTestingWebhook(true)
    try {
      // Test webhook verification
      const testURL = `${webhookURL}?hub.mode=subscribe&hub.verify_token=${verifyToken || "test"}&hub.challenge=test123`
      const response = await fetch(testURL, { method: "GET" })
      
      if (response.ok) {
        setWebhookStatus("verified")
        toast({ title: "Webhook Verified", description: "Your webhook is working correctly" })
      } else {
        setWebhookStatus("failed")
        toast({ 
          title: "Webhook Test Failed", 
          description: "Check your verify token and webhook configuration",
          variant: "destructive"
        })
      }
    } catch (error) {
      setWebhookStatus("failed")
      toast({ 
        title: "Webhook Test Error", 
        description: "Failed to test webhook connection",
        variant: "destructive"
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {label}
      </Badge>
    )
  }

  const configurationItems = [
    {
      label: "Phone Number",
      value: phoneNumber || "Not set",
      status: !!phoneNumber,
      required: true
    },
    {
      label: "Phone Number ID",
      value: phoneNumberId || "Not set",
      status: !!phoneNumberId,
      required: true
    },
    {
      label: "Access Token",
      value: accessToken ? "••••••••" : "Not set",
      status: !!accessToken,
      required: false
    },
    {
      label: "App Secret",
      value: appSecret ? "••••••••" : "Not set",
      status: !!appSecret,
      required: false
    },
    {
      label: "Verify Token",
      value: verifyToken || "Not set",
      status: !!verifyToken,
      required: true
    },
    {
      label: "Restaurant Active",
      value: isActive ? "Yes" : "No",
      status: isActive,
      required: true
    }
  ]

  const allRequiredConfigured = configurationItems
    .filter(item => item.required)
    .every(item => item.status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          WhatsApp Integration Status
        </CardTitle>
        <CardDescription>
          Current status of your WhatsApp Business API integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium">Integration Status</h4>
            <p className="text-sm text-muted-foreground">
              {allRequiredConfigured ? "Ready for production" : "Configuration incomplete"}
            </p>
          </div>
          {getStatusBadge(allRequiredConfigured, allRequiredConfigured ? "Ready" : "Incomplete")}
        </div>

        {/* Configuration Items */}
        <div className="space-y-3">
          <h4 className="font-medium">Configuration</h4>
          {configurationItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                  {item.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                </div>
                <p className="text-sm text-muted-foreground font-mono">{item.value}</p>
              </div>
              {getStatusIcon(item.status)}
            </div>
          ))}
        </div>

        {/* Webhook Status */}
        <div className="space-y-3">
          <h4 className="font-medium">Webhook Configuration</h4>
          <div className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Webhook URL</span>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">{webhookURL}</code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookURL)
                    toast({ title: "Copied", description: "Webhook URL copied to clipboard" })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Webhook Status</span>
              <div className="flex items-center gap-2">
                {webhookStatus === "verified" && getStatusBadge(true, "Verified")}
                {webhookStatus === "failed" && getStatusBadge(false, "Failed")}
                {webhookStatus === "unknown" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Unknown
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testWebhook}
                  disabled={isTestingWebhook || !verifyToken}
                >
                  {isTestingWebhook ? "Testing..." : "Test"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {!allRequiredConfigured && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Next Steps</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Configure all required fields above</li>
              <li>• Set up your WhatsApp Business API in Meta Developer Console</li>
              <li>• Configure the webhook URL in your WhatsApp app settings</li>
              <li>• Test the integration using the Quick Connect tool</li>
            </ul>
          </div>
        )}

        {/* Meta Developer Console Link */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => window.open("https://developers.facebook.com/apps", "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Meta Developer Console
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}