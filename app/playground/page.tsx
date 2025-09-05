"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// No mock client; we require a valid API key and always call server-backed Gemini
import type { ChatMessage, Restaurant } from "@/lib/data"
// import { mockRestaurants } from "@/lib/data" // Removed mock data usage
import { LocalStorage } from "@/src/lib/storage"
import { cn } from "@/lib/utils"

// Helper to remove markdown bold while preserving bullets
const stripBold = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1")

// Build a rich restaurant context string for the model
function buildRestaurantContext(r?: any): string {
  if (!r) return ""
  const lines: string[] = []
  lines.push(`Restaurant: ${r.name}`)
  if (r.description) lines.push(`Description: ${r.description}`)
  if (Array.isArray(r.supportedLanguages) && r.supportedLanguages.length)
    lines.push(`Supported languages: ${r.supportedLanguages.join(", ")}`)
  const c = r.chatbotContext || {}
  if (c.welcomeMessage) lines.push(`Welcome message: ${c.welcomeMessage}`)
  if (c.businessHours) lines.push(`Business hours: ${c.businessHours}`)
  if (c.deliveryInfo) lines.push(`Delivery info: ${c.deliveryInfo}`)
  if (c.specialInstructions) lines.push(`Special instructions: ${c.specialInstructions}`)
  const items = Array.isArray(r.menu) ? r.menu : []
  if (items.length) {
    lines.push("Menu (name - price - availability):")
    for (const it of items.slice(0, 50)) {
      const avail = it.isAvailable === false ? "(unavailable)" : ""
      lines.push(`- ${it.name}${it.price != null ? ` - ${it.price}` : ""} ${avail}`.trim())
    }
  }
  return lines.join("\n")
}

// Child initializer that reads search params and sets selection.
function SearchSelectInitializer({
  restaurants,
  selectedRestaurantId,
  setSelectedRestaurantId,
}: {
  restaurants: { id: string }[]
  selectedRestaurantId: string
  setSelectedRestaurantId: (id: string) => void
}) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (!restaurants.length) return
    const q = searchParams?.get("select")
    if (q) {
      const exists = restaurants.some((r) => r.id === q)
      setSelectedRestaurantId(exists ? q : restaurants[0].id)
    } else if (!selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants.length])
  return null
}

export default function PlaygroundPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("")
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored as Restaurant[])
      } else {
        // setRestaurants(mockRestaurants) // Removed mock data usage
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // API key gate state
  const [apiKey, setApiKey] = useState("")
  const [validatingKey, setValidatingKey] = useState(false)
  const [keyError, setKeyError] = useState<string>("")
  const [hasValidKey, setHasValidKey] = useState<boolean>(false)
  const [globalError, setGlobalError] = useState<string>("")

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const restaurant = useMemo(() => {
    if (!restaurants.length) return undefined
    return restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0]
  }, [restaurants, selectedRestaurantId])

  useEffect(() => {
    if (restaurant) {
      const welcome = restaurant.chatbotContext?.welcomeMessage || `Welcome to ${restaurant.name}! Ask me about the menu, prices, or make an order.`
      setMessages([
        {
          id: "sys_" + Date.now(),
          role: "assistant",
          content: stripBold(welcome),
          timestamp: new Date(),
        },
      ])
    }
  }, [restaurant?.id])

  // Load any stored key on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("gemini_api_key") || ""
    if (saved) {
      setApiKey(saved)
      // Optimistically mark as valid; we will re-validate on first send if needed
      setHasValidKey(true)
    }
  }, [])

  // Probe if server has a default API key configured; if yes, we can skip the prompt
  useEffect(() => {
    ;(async () => {
      if (hasValidKey) return
      try {
        const res = await fetch("/api/ai/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data?.ok) {
          setHasValidKey(true)
          setKeyError("")
        }
      } catch (_) {
        // ignore; prompt will remain
      }
    })()
  }, [hasValidKey])

  async function validateAndSaveKey() {
    setKeyError("")
    setValidatingKey(true)
    try {
      const res = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model: "models/gemini-1.5-flash" }),
      })
      const data = await res.json()
      if (!data?.ok) {
        throw new Error(data?.error || "Invalid API key")
      }
      if (typeof window !== "undefined") localStorage.setItem("gemini_api_key", apiKey)
      setHasValidKey(true)
      setGlobalError("")
    } catch (e: any) {
      setKeyError(e?.message || "Failed to validate API key")
      setHasValidKey(false)
    } finally {
      setValidatingKey(false)
    }
  }

  function clearStoredKey() {
    if (typeof window !== "undefined") localStorage.removeItem("gemini_api_key")
    setApiKey("")
    setHasValidKey(false)
  }

  const send = async () => {
    if (!input.trim() || !restaurant) return
    if (!hasValidKey) {
      setGlobalError("API key required. Click 'Change Key' to enter a valid key.")
      return
    }
    const userMsg: ChatMessage = { id: "u_" + Date.now(), role: "user", content: input.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsSending(true)
    try {
      // Server-backed generation with Gemini only
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(apiKey?.trim() ? { apiKey } : {}),
          model: "models/gemini-1.5-flash",
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          restaurantContext: buildRestaurantContext(restaurant),
        }),
      })
      const data = await res.json()
      if (!data?.ok) {
        const errMsg = String(data?.error || "Generation failed")
        setGlobalError(errMsg)
        throw new Error(errMsg)
      }
      const responseText = String(data?.response || "")

      const botMsg: ChatMessage = {
        id: "a_" + Date.now(),
        role: "assistant",
        content: stripBold(responseText),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      const errMsg: ChatMessage = {
        id: "e_" + Date.now(),
        role: "assistant",
        content: "Sorry, something went wrong generating a response.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsSending(false)
    }
  }

  // If no valid key, prompt for it first
  if (!isLoading && !hasValidKey) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-12">
          <Card>
            <CardHeader>
              <CardTitle>Enter Gemini API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Provide your Google Gemini API key to enable the server-backed assistant. Your key is stored locally in
                your browser and used only for requests from this page.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                />
                <Button onClick={validateAndSaveKey} disabled={validatingKey || !apiKey.trim()}>
                  {validatingKey ? "Validating..." : "Save & Continue"}
                </Button>
              </div>
              {keyError ? <div className="text-sm text-red-600 mt-2">{keyError}</div> : null}
              <div className="text-xs text-muted-foreground mt-3">
                Tip: You can clear or change the key anytime by refreshing and re-entering it.
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading playground...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!restaurants.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Create a restaurant first, then return to test your assistant here.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Initialize selection from URL under Suspense to satisfy Next.js 15 */}
        <Suspense fallback={null}>
          <SearchSelectInitializer
            restaurants={restaurants as any}
            selectedRestaurantId={selectedRestaurantId}
            setSelectedRestaurantId={setSelectedRestaurantId}
          />
        </Suspense>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assistant Playground</h1>
            <p className="text-muted-foreground">Test conversations without using WhatsApp.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearStoredKey}>Change Key</Button>
          </div>
        </div>

        {globalError ? (
          <div className="text-sm text-red-600">{globalError}</div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[520px] border rounded-md p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}> 
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{stripBold(m.content)}</div>
                      <div className="text-[10px] opacity-70 mt-1">{(() => {
                        const d = m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp as any)
                        return isNaN(d.getTime()) ? "" : d.toLocaleTimeString()
                      })()}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Type a message (e.g. 'Show me the menu')"
                />
                <Button onClick={send} disabled={isSending || !input.trim()}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
