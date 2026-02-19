"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, Sparkles, BrainCircuit, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiBridge } from "@/src/lib/api-client-bridge"
import { motion, AnimatePresence } from "framer-motion"

interface Business {
    id: string
    name: string
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export function ChatSimulator({ restaurants: businesses }: { restaurants: Business[] }) {
    const [selectedBusinessId, setSelectedBusinessId] = useState<string>(businesses[0]?.id || "")
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

    const handleBusinessChange = (val: string) => {
        setSelectedBusinessId(val)
        setMessages([])
    }

    const handleSend = async () => {
        if (!input.trim() || !selectedBusinessId) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const data: any = await apiBridge.processChat(userMsg.content, selectedBusinessId)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "No response."
            }
            setMessages(prev => [...prev, aiMsg])

        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "CRITICAL ERROR: Neural Bridge Disconnected. Please check API configuration." }])
        } finally {
            setIsLoading(false)
        }
    }

    if (businesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl border-dashed border-2">
                <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">No active business nodes detected.</p>
            </div>
        )
    }

    return (
        <Card className="w-full h-[700px] flex flex-col shadow-2xl border-none ring-1 ring-white/10 dark:ring-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden neural-glow neural-border">
            <CardHeader className="py-7 px-10 border-b border-white/10 dark:border-white/5 relative z-10 glass">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tighter text-gradient flex items-center gap-2">
                                NEURAL PREVIEW
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Inference Protocol Active</p>
                            </div>
                        </div>
                    </div>
                    <Select value={selectedBusinessId} onValueChange={handleBusinessChange}>
                        <SelectTrigger className="w-[240px] h-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 dark:text-white font-medium">
                            <SelectValue placeholder="Select Business Node" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 rounded-2xl">
                            {businesses.map(b => (
                                <SelectItem key={b.id} value={b.id} className="focus:bg-primary/10 rounded-xl">{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <div className="flex-1 overflow-hidden relative group">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

                <ScrollArea className="h-full px-8 py-10 custom-scrollbar" ref={scrollRef}>
                    <div className="space-y-8 max-w-4xl mx-auto pb-4">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mt-20 flex flex-col items-center"
                                >
                                    <div className="h-24 w-24 glass rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-float border-white/20">
                                        <Bot className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">WAITING FOR INPUT</h3>
                                    <p className="max-w-xs mx-auto text-muted-foreground font-medium leading-relaxed opacity-70">
                                        Select a business node above to initiate the RAG-augmented synthesis protocol.
                                    </p>
                                    <div className="flex items-center gap-2 mt-8 text-[10px] text-muted-foreground/40 font-mono">
                                        <Terminal className="h-3 w-3" />
                                        <span>SYSTEM_ID: MAFAL_NEURAL_V2</span>
                                    </div>
                                </motion.div>
                            )}

                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-4 group/msg",
                                        m.role === "user" ? "flex-row-reverse text-right" : "text-left"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2",
                                        m.role === "user"
                                            ? "bg-black text-white border-white/10 dark:bg-zinc-900"
                                            : "bg-primary text-white border-white/20"
                                    )}>
                                        {m.role === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[75%] p-5 rounded-[2rem] text-sm leading-relaxed transition-all duration-300",
                                        m.role === "user"
                                            ? "bg-black text-white dark:bg-zinc-900 rounded-tr-none shadow-xl border border-white/5"
                                            : "glass rounded-tl-none shadow-2xl dark:text-gray-100"
                                    )}>
                                        <p className={cn(m.role === "assistant" && "font-medium")}>{m.content}</p>
                                        <div className={cn(
                                            "mt-2 text-[9px] uppercase tracking-widest font-bold opacity-0 group-hover/msg:opacity-40 transition-opacity",
                                            m.role === "user" ? "text-right" : "text-left"
                                        )}>
                                            {m.role === "user" ? "SENT VIA PROTOCOL" : "GENERATED BY CLAUDE 3.5"}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-pulse border-2 border-white/20">
                                        <Bot className="h-6 w-6" />
                                    </div>
                                    <div className="glass rounded-[2rem] rounded-tl-none py-5 px-6 shadow-2xl flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Synthesizing Response...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Visual Accent Bottom Gradient */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white/20 dark:from-black/40 to-transparent pointer-events-none z-10" />
            </div>

            <CardFooter className="p-8 glass border-t border-white/10 relative z-20">
                <form
                    className="flex w-full gap-4 relative"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none font-mono text-[10px]">
                        CMD {">"}
                    </div>
                    <Input
                        placeholder="Type message for synthesis..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 h-14 pl-14 pr-16 rounded-[1.75rem] border-white/10 dark:border-white/5 focus-visible:ring-primary/20 shadow-inner bg-black/[0.02] dark:bg-white/[0.02] font-medium text-base transition-all"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "absolute right-2 top-2 h-10 w-10 rounded-2xl transition-all duration-500 shadow-xl",
                            input.trim()
                                ? "bg-primary text-white hover:bg-primary/90 hover:scale-110 hover:shadow-primary/40 rotate-0"
                                : "bg-muted text-muted-foreground opacity-50 grayscale"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
