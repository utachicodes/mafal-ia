"use client"

import { useState, useRef, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Search, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/src/components/language-switcher"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface PlatformLayoutProps {
    children: ReactNode
}

const searchRoutes = [
    { label: "Dashboard", path: "/dashboard", keywords: ["dashboard", "home", "overview"] },
    { label: "Orders", path: "/dashboard/orders", keywords: ["orders", "order", "purchase"] },
    { label: "Analytics", path: "/dashboard/analytics", keywords: ["analytics", "stats", "data", "reports"] },
    { label: "Businesses", path: "/dashboard/businesses", keywords: ["business", "businesses", "restaurant", "restaurants"] },
    { label: "Playground", path: "/playground", keywords: ["playground", "chat", "test", "chatbot", "simulator"] },
    { label: "Settings", path: "/dashboard/settings", keywords: ["settings", "config", "configuration", "preferences"] },
]

export function PlatformLayout({ children }: PlatformLayoutProps) {
    const [collapsed, setCollapsed] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchOpen, setSearchOpen] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    const searchResults = searchQuery.trim()
        ? searchRoutes.filter(r =>
            r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.keywords.some(k => k.includes(searchQuery.toLowerCase()))
        )
        : []

    function handleSearchSelect(path: string) {
        setSearchQuery("")
        setSearchOpen(false)
        router.push(path)
    }

    function handleSearchKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && searchResults.length > 0) {
            handleSearchSelect(searchResults[0].path)
        }
        if (e.key === "Escape") {
            setSearchQuery("")
            setSearchOpen(false)
            searchRef.current?.blur()
        }
    }

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
                <header className="h-20 flex items-center justify-between px-8 border-b border-border glass bg-background/30 z-40">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search business, orders..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setSearchOpen(e.target.value.trim().length > 0)
                                }}
                                onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full bg-muted border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(""); setSearchOpen(false) }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <AnimatePresence>
                                {searchOpen && searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="absolute top-full mt-2 left-0 right-0 glass rounded-xl border border-border shadow-xl overflow-hidden z-50"
                                    >
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.path}
                                                onMouseDown={() => handleSearchSelect(result.path)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                                            >
                                                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                                {result.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                                {searchOpen && searchQuery.trim() && searchResults.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="absolute top-full mt-2 left-0 right-0 glass rounded-xl border border-border shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 text-sm text-muted-foreground">
                                            No results found
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />

                        <div className="h-6 w-px bg-border mx-2" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-xl hover:bg-muted"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-80 p-0">
                                <div className="p-4 border-b border-border">
                                    <h4 className="font-semibold text-sm">Notifications</h4>
                                </div>
                                <div className="p-8 text-center">
                                    <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No new notifications</p>
                                </div>
                            </PopoverContent>
                        </Popover>
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
