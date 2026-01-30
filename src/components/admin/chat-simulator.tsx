"use client"

import { useState } from "react"
import { Send, Bot, User, Trash2, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ChatSimulatorProps {
    restaurantId: string
    restaurantName: string
}

interface Message {
    role: "user" | "assistant"
    content: string
}

export default function ChatSimulator({ restaurantId, restaurantName }: ChatSimulatorProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg = input.trim()
        setInput("")
        setMessages((prev) => [...prev, { role: "user", content: userMsg }])
        setLoading(true)

        try {
            const res = await fetch(`/api/admin/restaurants/${restaurantId}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to send message")

            setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
        } catch (error) {
            toast.error("Error generating response")
            console.error(error)
            // Optional: Remove user message if failed? Nah, just show error toast.
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setMessages([])
        // Note: This only clears UI. The backend "SIMULATOR" history persists unless we add a specific "clear history" endpoint.
        // Ideally we'd have a 'DELETE' endpoint to wipe simulator history.
        toast.info("Chat cleared (Context remains in backend)")
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-md bg-white dark:bg-gray-900 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    <div>
                        <h3 className="font-semibold text-sm">Simulator: {restaurantName}</h3>
                        <p className="text-xs text-muted-foreground">Te sting as "Admin Simulator"</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleReset} title="Clear Chat UI">
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 mt-20">
                        <Bot className="h-12 w-12 opacity-20" />
                        <p>Start chatting to test the AI.</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setInput("Hello")}>"Hello"</Button>
                            <Button variant="outline" size="sm" onClick={() => setInput("Show me the menu")}>"Show menu"</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    msg.role === "user"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted animate-pulse">
                                Thinking...
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t mt-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={loading}
                        autoFocus
                    />
                    <Button type="submit" disabled={loading || !input.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}
