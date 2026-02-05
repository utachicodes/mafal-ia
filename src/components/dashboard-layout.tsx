"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, Store, BarChart3, Settings, MessageSquare, Key, PanelLeftOpen, PanelLeftClose, Sparkles, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Restaurants", href: "/restaurants", icon: Store },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Initializing Mafal-IA...</p>
      </div>
    </div>
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl md:bg-transparent">
      {/* Premium Logo Area */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="h-8" />
        </Link>
      </div>

      {!collapsed && <div className="px-6 mb-4"><div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" /></div>}

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_var(--primary)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              {isActive && <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />}
              <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 mt-auto">
        <div className={cn("rounded-xl border bg-card/50 p-3 flex items-center gap-3 backdrop-blur-sm", collapsed && "justify-center p-2")}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">UtachiCodes</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Desktop Sidebar (Floating Glass) */}
      <div className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-4 md:left-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        collapsed ? "md:w-20" : "md:w-72"
      )}>
        <div className="flex flex-col flex-grow rounded-2xl glass border-white/20 dark:border-white/10 overflow-hidden shadow-2xl">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-0 bg-background/80 backdrop-blur-xl">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        collapsed ? "md:pl-28" : "md:pl-80"
      )}>
        {/* Top bar (Floating) */}
        <div className="h-20 flex items-center px-8 sticky top-0 z-40">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(true)}>
            <PanelLeftOpen className="h-6 w-6" />
          </Button>

          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="opacity-50 hover:opacity-100 transition-opacity">
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="glass px-2 py-1 rounded-full"><SimpleThemeToggle /></div>
            <Button asChild variant="outline" className="rounded-full gap-2 hidden sm:flex border-primary/20 hover:bg-primary/5">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span>System</span>
              </Link>
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
