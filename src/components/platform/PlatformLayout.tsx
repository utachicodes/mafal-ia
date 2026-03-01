"use client"

import { useState, useRef, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { AnimatePresence, motion } from "framer-motion"
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
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setSearchOpen(e.target.value.trim().length > 0)
                                }}
                                onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full bg-muted border border-border rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-colors"
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
                                        className="absolute top-full mt-1 left-0 right-0 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50"
                                    >
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.path}
                                                onMouseDown={() => handleSearchSelect(result.path)}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
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
                                        className="absolute top-full mt-1 left-0 right-0 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No results found
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-lg h-8 w-8"
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 relative">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-72 p-0">
                                <div className="p-3 border-b border-border">
                                    <h4 className="font-medium text-sm">Notifications</h4>
                                </div>
                                <div className="p-6 text-center">
                                    <Bell className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No new notifications</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
