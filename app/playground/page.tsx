"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIClientBrowser as AIClient } from "@/src/lib/ai-client-browser"
import type { ChatMessage } from "@/lib/data"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import { cn } from "@/lib/utils"

export default function PlaygroundPage() {
  const { restaurants, isLoading } = useRestaurants()
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("")
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const restaurant = useMemo(() => {
    if (!restaurants.length) return undefined
    return restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0]
  }, [restaurants, selectedRestaurantId])

  useEffect(() => {
    if (restaurant) {
      setMessages([
        {
          id: "sys_" + Date.now(),
          role: "assistant",
          content: `Welcome to ${restaurant.name}! Ask me about the menu, prices, or make an order.`,
          timestamp: new Date(),
        },
      ])
    }
  }, [restaurant?.id])

  const send = async () => {
    if (!input.trim() || !restaurant) return
    const userMsg: ChatMessage = { id: "u_" + Date.now(), role: "user", content: input.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsSending(true)
    try {
      const res = await AIClient.generateResponse(
        [...messages, userMsg],
        restaurant.chatbotContext?.welcomeMessage || `Restaurant: ${restaurant.name}`,
        restaurant.menu || [],
        restaurant.name,
      )
      const botMsg: ChatMessage = {
        id: "a_" + Date.now(),
        role: "assistant",
        content: String((res as any).response ?? "I couldn't generate a response."),
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
          </div>
        </div>

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
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      <div className="text-[10px] opacity-70 mt-1">{m.timestamp.toLocaleTimeString()}</div>
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
