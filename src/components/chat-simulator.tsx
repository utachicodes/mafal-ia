"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Restaurant {
    id: string
    name: string
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export function ChatSimulator({ restaurants }: { restaurants: Restaurant[] }) {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurants[0]?.id || "")
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string>("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Clear chat when switching restaurants
    const handleRestaurantChange = (val: string) => {
        setSelectedRestaurantId(val)
        setMessages([])
        setSessionId(`web_${Date.now()}`) // New session
    }

    const handleSend = async () => {
        if (!input.trim() || !selectedRestaurantId) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: selectedRestaurantId,
                    message: userMsg.content,
                    sessionId: sessionId || undefined
                })
            })

            const data = await res.json()

            if (data.sessionId) setSessionId(data.sessionId)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "No response."
            }
            setMessages(prev => [...prev, aiMsg])

        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Error: Could not connect to AI." }])
        } finally {
            setIsLoading(false)
        }
    }

    if (restaurants.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No restaurants available. Create one first!</div>
    }

    return (
        <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col shadow-xl">
            <CardHeader className="py-4 border-b bg-neutral-50/50">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg">Live Simulator</CardTitle>
                    </div>
                    <Select value={selectedRestaurantId} onValueChange={handleRestaurantChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Restaurant" />
                        </SelectTrigger>
                        <SelectContent>
                            {restaurants.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <div className="flex-1 overflow-hidden p-4 bg-slate-50 relative">
                <ScrollArea className="h-full pr-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-20">
                                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Select a restaurant and say hello!</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div key={m.id} className={cn(
                                "flex gap-3 max-w-[80%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border shadow-sm"
                                )}>
                                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-white text-foreground border rounded-tl-sm"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mr-auto max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-white border rounded-2xl rounded-tl-sm p-3 shadow-sm flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <CardFooter className="p-4 border-t bg-white">
                <form
                    className="flex w-full gap-2"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
