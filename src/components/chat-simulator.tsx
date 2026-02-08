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
        <Card className="w-full h-[600px] flex flex-col shadow-xl border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="py-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Live Simulator
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Test AI responses in real-time</p>
                    </div>
                    <Select value={selectedRestaurantId} onValueChange={handleRestaurantChange}>
                        <SelectTrigger className="w-[220px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-red-500/20">
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

            <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-950/50 dark:to-gray-900/50 relative">
                <ScrollArea className="h-full px-4 py-6" ref={scrollRef}>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-20 flex flex-col items-center">
                                <div className="h-20 w-20 bg-gradient-to-br from-red-100 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mb-6 shadow-md">
                                    <Bot className="h-10 w-10 text-red-600 dark:text-red-400 opacity-80" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ready to test</h3>
                                <p className="max-w-xs mx-auto">Select a restaurant and send a message to simulate a customer interaction.</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div key={m.id} className={cn(
                                "flex gap-4 max-w-[85%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/20",
                                    m.role === "user"
                                        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white dark:from-gray-700 dark:to-gray-800"
                                        : "bg-gradient-to-br from-red-600 to-red-700 text-white"
                                )}>
                                    {m.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm shadow-md",
                                    m.role === "user"
                                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-sm border border-gray-100 dark:border-gray-700"
                                        : "bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-950 border border-red-100 dark:border-red-900/30 text-gray-900 dark:text-gray-100 rounded-tl-sm"
                                )}>
                                    <p className="leading-relaxed">{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4 mr-auto max-w-[85%]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-sm">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-md flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-500 animate-pulse">Mafal-IA is typing</span>
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <CardFooter className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <form
                    className="flex w-full gap-3 relative"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <Input
                        placeholder="Type a message as a customer..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 py-6 pl-6 pr-12 rounded-full border-gray-200 dark:border-gray-700 focus-visible:ring-red-500/20 shadow-inner bg-gray-50 dark:bg-gray-950"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "absolute right-2 top-1.5 h-9 w-9 rounded-full transition-all duration-300 shadow-md",
                            input.trim()
                                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 hover:scale-105 hover:shadow-red-500/25"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
