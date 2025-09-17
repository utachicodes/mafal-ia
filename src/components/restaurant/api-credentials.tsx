"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import { useToast } from "@/hooks/use-toast"
import type { Restaurant } from "@/lib/data"

interface ApiCredentialsProps {
  restaurant: Restaurant
}

export function ApiCredentials({ restaurant }: ApiCredentialsProps) {
  const [phoneId, setPhoneId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [appSecret, setAppSecret] = useState("")
  const [verifyToken, setVerifyToken] = useState("")
  const [savingPhoneId, setSavingPhoneId] = useState(false)
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true)
  const { updateRestaurant } = useRestaurants()
  const { toast } = useToast()

  // Connection tests state
  const [isTestingVerify, setIsTestingVerify] = useState(false)
  const [verifyResult, setVerifyResult] = useState<null | { status: number; ok: boolean; body: string; passed: boolean; url: string }>(null)
  const [isTestingSigned, setIsTestingSigned] = useState(false)
  const [signedResult, setSignedResult] = useState<null | { status: number; ok: boolean; body: string }>(null)

  // Load credentials when component mounts
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurant.id}/credentials`)
        if (res.ok) {
          const data = await res.json()
          setPhoneId(data.whatsappPhoneNumberId || "")
          setAccessToken(data.whatsappAccessToken || "")
          setAppSecret(data.whatsappAppSecret || "")
          setVerifyToken(data.webhookVerifyToken || "")
        }
      } catch (error) {
        console.error("Failed to load credentials:", error)
      } finally {
        setIsLoadingCredentials(false)
      }
    }
    loadCredentials()
  }, [restaurant.id])

  if (isLoadingCredentials) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Credentials</CardTitle>
          <CardDescription>Configure WhatsApp webhook and secrets for this restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneId(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="wa-access-token">Per-restaurant Access Token (optional)</Label>
            <div className="flex gap-2">
              <Input id="wa-access-token" type="password" value={accessToken} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessToken(e.target.value)} />
              <Button
                variant="default"
                onClick={async () => {
                  const res = await fetch(`/api/restaurants/${restaurant.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apiCredentials: { whatsappAccessToken: accessToken } }),
                  })
                  if (!res.ok) throw new Error("Failed to save access token")
                }}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Overrides global token for sending messages for this restaurant.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wa-app-secret">Per-restaurant App Secret (optional)</Label>
            <div className="flex gap-2">
              <Input id="wa-app-secret" type="password" value={appSecret} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppSecret(e.target.value)} />
              <Button
                variant="default"
                onClick={async () => {
                  const res = await fetch(`/api/restaurants/${restaurant.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apiCredentials: { whatsappAppSecret: appSecret } }),
                  })
                  if (!res.ok) throw new Error("Failed to save app secret")
                }}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Used to validate webhook signatures for this restaurant.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verify-token">Webhook Verify Token (optional)</Label>
            <div className="flex gap-2">
              <Input id="verify-token" value={verifyToken} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerifyToken(e.target.value)} />
              <Button
                variant="default"
                onClick={async () => {
                  const res = await fetch(`/api/restaurants/${restaurant.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apiCredentials: { webhookVerifyToken: verifyToken } }),
                  })
                  if (!res.ok) throw new Error("Failed to save verify token")
                  updateRestaurant(restaurant.id, {
                    apiCredentials: { ...restaurant.apiCredentials, webhookVerifyToken: verifyToken },
                  })
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/restaurants/${restaurant.id}/credentials/generate-verify-token`, { method: "POST" })
                    if (!res.ok) throw new Error("Failed to generate token")
                    const data = await res.json()
                    setVerifyToken(data.webhookVerifyToken)
                    updateRestaurant(restaurant.id, {
                      apiCredentials: { ...restaurant.apiCredentials, webhookVerifyToken: data.webhookVerifyToken },
                    })
                    toast({ title: "Verify token generated", description: "Token saved for this restaurant." })
                  } catch (e) {
                    toast({ title: "Error", description: "Could not generate token." })
                  }
                }}
              >
                Generate
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(verifyToken)
                  toast({ title: "Copied", description: "Verify token copied to clipboard" })
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Used during Meta webhook verification GET request.</p>
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
            <div className="flex gap-2">
              <code className="flex-1 p-3 bg-muted rounded-md text-sm break-all">
                {typeof window !== "undefined" ? `${window.location.origin}/api/whatsapp` : "/api/whatsapp"}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const url = typeof window !== "undefined" ? `${window.location.origin}/api/whatsapp` : "/api/whatsapp"
                  navigator.clipboard.writeText(url)
                  toast({ title: "Copied", description: "Webhook URL copied to clipboard" })
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this full URL when configuring your WhatsApp Business API webhook in Meta Developer Console
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Meta Verify Token</h4>
            <code className="block p-3 bg-muted rounded-md text-sm">{verifyToken || "<set a token above>"}</code>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Setup Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Configure your WhatsApp Business API webhook URL</li>
              <li>Test the integration using the Live View tab</li>
              <li>Deploy your chatbot to production</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status / Real Tests</CardTitle>
          <CardDescription>Validate your configuration against the live webhook endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">GET Verification</h4>
              <p className="text-xs text-muted-foreground">Calls your deployed webhook with the stored verify token and checks if the challenge is echoed.</p>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  disabled={isTestingVerify || !verifyToken}
                  onClick={async () => {
                    try {
                      setIsTestingVerify(true)
                      setVerifyResult(null)
                      const res = await fetch(`/api/restaurants/${restaurant.id}/credentials/test-verify`, { method: "POST" })
                      const data = await res.json()
                      setVerifyResult({ status: data.status, ok: data.ok, body: data.body, passed: Boolean(data.passed), url: data.requestedUrl })
                      if (data.passed) {
                        toast({ title: "Verification OK", description: "Webhook responded with the expected challenge." })
                      } else {
                        toast({ title: "Verification failed", description: `Status ${data.status}. Check token or endpoint.` })
                      }
                    } catch (e) {
                      toast({ title: "Error", description: "Could not run GET verification." })
                    } finally {
                      setIsTestingVerify(false)
                    }
                  }}
                >
                  {isTestingVerify ? "Testing..." : "Run GET Verify"}
                </Button>
              </div>
              {verifyResult && (
                <div className={`text-xs rounded-md p-3 ${verifyResult.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  <div><span className="font-semibold">URL:</span> {verifyResult.url}</div>
                  <div><span className="font-semibold">Status:</span> {verifyResult.status} {verifyResult.ok ? "(ok)" : "(failed)"}</div>
                  <div className="break-all"><span className="font-semibold">Body:</span> {verifyResult.body}</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Signed POST</h4>
              <p className="text-xs text-muted-foreground">Sends a minimal, signed WhatsApp payload using your App Secret.</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isTestingSigned || !appSecret || !phoneId}
                  onClick={async () => {
                    try {
                      setIsTestingSigned(true)
                      setSignedResult(null)
                      const res = await fetch(`/api/restaurants/${restaurant.id}/credentials/test-signed-post`, { method: "POST" })
                      const data = await res.json()
                      setSignedResult({ status: data.status, ok: Boolean(data.ok), body: String(data.body ?? "") })
                      if (data.ok) {
                        toast({ title: "Signed POST accepted", description: "Webhook processed the signed payload." })
                      } else {
                        toast({ title: "Signed POST failed", description: `Status ${data.status}. Check App Secret or route.` })
                      }
                    } catch (e) {
                      toast({ title: "Error", description: "Could not run signed POST." })
                    } finally {
                      setIsTestingSigned(false)
                    }
                  }}
                >
                  {isTestingSigned ? "Sending..." : "Send Signed POST"}
                </Button>
              </div>
              {signedResult && (
                <div className={`text-xs rounded-md p-3 ${signedResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  <div><span className="font-semibold">Status:</span> {signedResult.status} {signedResult.ok ? "(ok)" : "(failed)"}</div>
                  <div className="break-all"><span className="font-semibold">Body:</span> {signedResult.body}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
