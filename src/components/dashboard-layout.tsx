"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
// import { useSession } from "next-auth/react" // Auth disabled
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, Store, BarChart3, Settings, PanelLeftOpen, PanelLeftClose, ShoppingBag, FlaskConical } from "lucide-react"
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
  { name: "Dashboard", href: "/dashboard", icon: Home, exact: true },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, exact: false },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, exact: false },
  { name: "Businesses", href: "/dashboard/businesses", icon: Store, exact: false },
  { name: "Playground", href: "/playground", icon: FlaskConical, exact: false },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  // Auth disabled — mock session
  const session = { user: { name: "Admin", plan: "PREMIUM" } } as any

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // content fallback handled by layout or loading.tsx
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-black border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-500 overflow-hidden relative glass">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Logo Area */}
      <div className={cn("flex items-center h-20 px-6 border-b border-gray-100/50 dark:border-gray-900/50 relative z-10", collapsed && "justify-center px-2")}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className={cn("h-9", collapsed && "w-10 overflow-hidden")} />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/5 dark:text-primary dark:border-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.05)] border neural-border"
                  : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/30 dark:hover:text-gray-200 border border-transparent",
                collapsed && "justify-center px-2"
              )}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
                isActive
                  ? "text-gray-900 dark:text-gray-100 scale-110"
                  : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 group-hover:scale-105"
              )} />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-gray-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors", collapsed && "justify-center p-2")}>
          <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-800 shadow-sm">
            <AvatarFallback className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-semibold text-xs">
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
        "hidden md:flex flex-col z-40 transition-all duration-300 ease-in-out fixed inset-y-0 left-0 h-full shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-0 z-50">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out",
        !collapsed ? "md:ml-64" : "md:ml-20"
      )}>
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 glass z-30 sticky top-0 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
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
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
