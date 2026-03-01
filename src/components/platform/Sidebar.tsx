"use client"

import { useState, useEffect } from "react"
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
// import { useSession, signOut } from "next-auth/react" // Auth disabled

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
    // Auth disabled — mock session
    const session = { user: { name: "Admin", role: "ADMIN" } } as any

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            className={cn(
                "relative h-screen flex flex-col border-r glass bg-background/50 transition-colors duration-500",
                "z-50"
            )}
        >
            {/* Header / Logo */}
            <div className={cn(
                "h-20 flex items-center px-6 mb-4 border-b border-border",
                collapsed && "justify-center px-0"
            )}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Logo className="h-6 w-auto" />
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 py-4">
                {navigation.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                <Icon className={cn(
                                    "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                )} />

                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium text-sm"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}

                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-border">
                {!collapsed ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-muted border border-border">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{session?.user?.name || "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">{(session?.user as any)?.role || "Admin"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { /* auth disabled */ }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <button
                            onClick={() => { /* auth disabled */ }}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border border-border"
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
        </motion.div>
    )
}
