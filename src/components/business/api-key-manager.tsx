"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, KeyRound, ShieldOff, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RestaurantSummary {
  id: string
  name: string
}

interface RestaurantDetails extends RestaurantSummary {
  apiKeyCreatedAt?: string | null
  apiKeyRevokedAt?: string | null
  apiKeyHash?: string | null
}

export default function ApiKeyManager({ businessId: initialRestaurantId }: { businessId?: string }) {
  const { toast } = useToast()
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>(initialRestaurantId)
  const [loadingRestaurants, setLoadingRestaurants] = useState(false)

  const [details, setDetails] = useState<RestaurantDetails | null>(null)
  const [fetchingDetails, setFetchingDetails] = useState(false)

  const [generating, setGenerating] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const [plaintextKey, setPlaintextKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load restaurants for selection if no prop provided
  useEffect(() => {
    if (initialRestaurantId) return
    let cancelled = false
    ;(async () => {
      try {
        setLoadingRestaurants(true)
        const res = await fetch("/api/restaurants")
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as RestaurantSummary[]
        if (!cancelled) {
          setRestaurants(data)
          if (!selectedId && data.length > 0) setSelectedId(data[0].id)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load restaurants")
      } finally {
        if (!cancelled) setLoadingRestaurants(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [initialRestaurantId])

  // Keep selectedId synced with prop
  useEffect(() => {
    if (initialRestaurantId) setSelectedId(initialRestaurantId)
  }, [initialRestaurantId])

  // Fetch details for selected restaurant
  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    ;(async () => {
      try {
        setFetchingDetails(true)
        const res = await fetch(`/api/restaurants/${selectedId}`)
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as RestaurantDetails
        if (!cancelled) setDetails(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load restaurant details")
      } finally {
        if (!cancelled) setFetchingDetails(false)
      }
    })()
    return () => { cancelled = true }
  }, [selectedId])

  const hasActiveKey = useMemo(() => {
    if (!details) return false
    return !!details.apiKeyHash && !details.apiKeyRevokedAt
  }, [details])

  async function onGenerate() {
    if (!selectedId) return
    setError(null)
    setGenerating(true)
    setPlaintextKey(null)
    try {
      const res = await fetch(`/api/restaurants/${selectedId}/api-key`, { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setPlaintextKey(data.apiKey)
      toast({ title: "API key generated", description: "Copy and store it securely." })
      // Refresh details to pick up createdAt
      await refreshDetails()
    } catch (e: any) {
      setError(e?.message || "Failed to generate API key")
      toast({ title: "Failed to generate", description: e?.message || "", variant: "destructive" })
    } finally {
      setGenerating(false)
    }
  }

  async function onRevoke() {
    if (!selectedId) return
    if (!confirm("Revoke the current API key? This action cannot be undone.")) return
    setError(null)
    setRevoking(true)
    try {
      const res = await fetch(`/api/restaurants/${selectedId}/api-key`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      await refreshDetails()
      setPlaintextKey(null)
      toast({ title: "API key revoked", description: "The previous key is no longer valid." })
    } catch (e: any) {
      setError(e?.message || "Failed to revoke API key")
      toast({ title: "Failed to revoke", description: e?.message || "", variant: "destructive" })
    } finally {
      setRevoking(false)
    }
  }

  async function refreshDetails() {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/restaurants/${selectedId}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setDetails(data)
    } catch (e) {
      // ignore here; error already handled in other path
    }
  }

  function copyToClipboard() {
    if (!plaintextKey) return
    navigator.clipboard.writeText(plaintextKey)
    toast({ title: "Copied", description: "API key copied to clipboard." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4"/> Chatbot API Key</CardTitle>
        <CardDescription>Generate and manage a server key for authenticating chatbot API requests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!initialRestaurantId && (
          <div className="grid gap-2">
            <Label>Business</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder={loadingRestaurants ? "Loading..." : "Select a restaurant"} />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label>Status</Label>
          <div className="text-sm text-muted-foreground">
            {fetchingDetails && "Loading details..."}
            {!fetchingDetails && details && (
              hasActiveKey ? (
                <span>Active key created at {details.apiKeyCreatedAt ? new Date(details.apiKeyCreatedAt).toLocaleString() : "unknown"}</span>
              ) : details.apiKeyRevokedAt ? (
                <span>Key revoked at {new Date(details.apiKeyRevokedAt).toLocaleString()}</span>
              ) : (
                <span>No active key</span>
              )
            )}
          </div>
        </div>

        {plaintextKey && (
          <div className="grid gap-2">
            <Label>Your new API key (store it securely)</Label>
            <div className="flex gap-2">
              <Input readOnly value={plaintextKey} />
              <Button type="button" variant="outline" onClick={copyToClipboard} title="Copy">
                <Copy className="h-4 w-4"/>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">This key is shown only once. You won’t be able to view it again.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onGenerate} disabled={!selectedId || generating}>
          <RefreshCw className="h-4 w-4 mr-2"/>
          {generating ? "Generating..." : "Generate new key"}
        </Button>
        <Button variant="destructive" onClick={onRevoke} disabled={!selectedId || !hasActiveKey || revoking}>
          <ShieldOff className="h-4 w-4 mr-2"/>
          {revoking ? "Revoking..." : "Revoke key"}
        </Button>
      </CardFooter>
    </Card>
  )
}
