"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, BrainCircuit, Sparkles, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { apiBridge } from "@/src/lib/api-client-bridge"
import { motion, AnimatePresence } from "framer-motion"

interface ChatSimulatorProps {
    businessId: string
    businessName: string
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export default function ChatSimulator({ businessId, businessName }: ChatSimulatorProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const data: any = await apiBridge.processChat(userMsg.content, businessId)
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "No response."
            }])
        } catch (error) {
            toast.error("Error generating response from Neural Engine")
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "CRITICAL ERROR: Neural Bridge Disconnected. Please check API configuration."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setMessages([])
        toast.info("Chat cleared (Context remains in backend)")
    }

    return (
        <Card className="w-full h-[600px] flex flex-col shadow-2xl border-none ring-1 ring-white/10 dark:ring-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden neural-glow neural-border">
            {/* Header */}
            <CardHeader className="py-6 px-8 border-b border-white/10 dark:border-white/5 relative z-10 glass">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black tracking-tighter text-gradient flex items-center gap-2">
                                {businessName}
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Neural Inference Mode</p>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleReset} title="Reset Protocol" className="rounded-2xl hover:bg-white/10">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full px-8 py-8 custom-scrollbar" ref={scrollRef}>
                    <div className="space-y-6 max-w-3xl mx-auto pb-4">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mt-16 flex flex-col items-center"
                                >
                                    <div className="h-20 w-20 glass rounded-3xl flex items-center justify-center mb-6 shadow-2xl border-white/20">
                                        <Bot className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">WAITING FOR INPUT</h3>
                                    <p className="max-w-xs mx-auto text-muted-foreground font-medium leading-relaxed opacity-70 text-sm">
                                        Initiate chat to verify AI parameters for this business node.
                                    </p>
                                    <div className="flex items-center gap-2 mt-6 text-[10px] text-muted-foreground/40 font-mono">
                                        <Terminal className="h-3 w-3" />
                                        <span>SYSTEM_ID: MAFAL_NEURAL_V2</span>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setInput("Hello")}>
                                            "Hello"
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setInput("Show me the menu")}>
                                            "Show me the menu"
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-3 group/msg",
                                        m.role === "user" ? "flex-row-reverse text-right" : "text-left"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2",
                                        m.role === "user"
                                            ? "bg-black text-white border-white/10 dark:bg-zinc-900"
                                            : "bg-primary text-white border-white/20"
                                    )}>
                                        {m.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[75%] p-4 rounded-[1.75rem] text-sm leading-relaxed transition-all duration-300",
                                        m.role === "user"
                                            ? "bg-black text-white dark:bg-zinc-900 rounded-tr-none shadow-xl border border-white/5"
                                            : "glass rounded-tl-none shadow-2xl dark:text-gray-100"
                                    )}>
                                        <p className={cn(m.role === "assistant" && "font-medium")}>{m.content}</p>
                                        <div className={cn(
                                            "mt-1.5 text-[9px] uppercase tracking-widest font-bold opacity-0 group-hover/msg:opacity-40 transition-opacity",
                                            m.role === "user" ? "text-right text-white/60" : "text-left"
                                        )}>
                                            {m.role === "user" ? "SENT VIA SIMULATOR" : "GENERATED BY AI"}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-pulse border-2 border-white/20">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="glass rounded-[1.75rem] rounded-tl-none py-4 px-5 shadow-2xl flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Synthesizing Response...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Visual Accent Bottom Gradient */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white/20 dark:from-black/40 to-transparent pointer-events-none z-10" />
            </div>

            {/* Input */}
            <CardFooter className="p-6 glass border-t border-white/10 relative z-20">
                <form
                    className="flex w-full gap-3 relative"
                    onSubmit={(e) => { e.preventDefault(); handleSend() }}
                >
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none font-mono text-[10px]">
                        CMD {">"}
                    </div>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type message for synthesis..."
                        disabled={isLoading}
                        autoFocus
                        className="flex-1 h-12 pl-12 pr-14 rounded-[1.75rem] border-white/10 dark:border-white/5 focus-visible:ring-primary/20 shadow-inner bg-black/[0.02] dark:bg-white/[0.02] font-medium transition-all"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "absolute right-2 top-1.5 h-9 w-9 rounded-2xl transition-all duration-500 shadow-xl",
                            input.trim()
                                ? "bg-primary text-white hover:bg-primary/90 hover:scale-110"
                                : "bg-muted text-muted-foreground opacity-50 grayscale"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
