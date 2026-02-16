"use client"

import { useState, ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { motion } from "framer-motion"
import { Bell, Search, Moon, Sun, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/src/components/language-switcher"

interface PlatformLayoutProps {
    children: ReactNode
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
    const [collapsed, setCollapsed] = useState(false)
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
                {/* Ambient Background Glows */}
                <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 glass bg-background/30 z-40">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search business, orders..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />

                        <div className="h-6 w-px bg-white/10 mx-2" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-xl hover:bg-white/5"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
