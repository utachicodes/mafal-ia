"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // content fallback handled by layout or loading.tsx
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50 border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      {/* Logo Area */}
      <div className={cn("flex items-center h-16 px-6 border-b border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm", collapsed && "justify-center px-2")}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className={cn("h-8", collapsed && "w-10 overflow-hidden")} />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 dark:from-red-950/30 dark:to-red-950/10 dark:text-red-400 shadow-sm"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:from-gray-900/50 dark:hover:to-transparent dark:hover:text-gray-200",
                collapsed && "justify-center px-2"
              )}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full" />
              )}
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
                isActive
                  ? "text-red-500 dark:text-red-400 scale-110"
                  : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 group-hover:scale-105"
              )} />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors", collapsed && "justify-center p-2")}>
          <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-800 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 dark:from-red-950/30 dark:to-red-900/20 dark:text-red-400 font-semibold text-xs">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {(session?.user as any)?.plan || "Standard"} Plan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col z-30 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-gray-500" onClick={() => setSidebarOpen(true)}>
              <PanelLeftOpen className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white md:hidden">Mafalia</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <SimpleThemeToggle />
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            <Button asChild variant="ghost" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none scrollbar-hide custom-scrollbar">
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
