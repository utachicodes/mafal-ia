"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    Home,
    ShoppingBag,
    BarChart3,
    Store,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    MessageSquare
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/src/components/logo"

const navigation = [
    { name: "Dashboard", href: "/dashboard", exact: true, icon: Home },
    { name: "Orders", href: "/dashboard/orders", exact: false, icon: ShoppingBag },
    { name: "Analytics", href: "/dashboard/analytics", exact: false, icon: BarChart3 },
    { name: "Businesses", href: "/dashboard/businesses", exact: false, icon: Store },
    { name: "Playground", href: "/playground", exact: false, icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", exact: false, icon: Settings },
]

interface SidebarProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname()
    const session = { user: { name: "Admin", role: "ADMIN" } } as any

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 64 : 240 }}
            className="relative h-screen flex flex-col border-r border-border bg-card z-50"
        >
            {/* Logo */}
            <div className={cn(
                "h-14 flex items-center px-4 border-b border-border",
                collapsed && "justify-center px-0"
            )}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <Logo className="h-5 w-auto" />
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 py-3">
                {navigation.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                <Icon className="h-4 w-4 shrink-0" />

                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-medium"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-3 border-t border-border">
                {!collapsed ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">{(session?.user as any)?.role || "Admin"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { /* auth disabled */ }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <button
                            onClick={() => { /* auth disabled */ }}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors z-50"
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
        </motion.div>
    )
}
