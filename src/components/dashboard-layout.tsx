"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Menu, Home, Store, BarChart3, Settings, MessageSquare, Key } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Restaurants", href: "/restaurants", icon: Store },
  { name: "Playground", href: "/playground", icon: MessageSquare },
  { name: "Onboarding", href: "/onboarding", icon: Key },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-3">
        <div className="h-7 text-foreground flex items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
        </div>
      </div>
      <div className="px-6"><div className="h-px w-full bg-border" /></div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground ring-1 ring-primary/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className={cn("h-4 w-4 transition-transform duration-200", isActive ? "scale-105" : "group-hover:scale-105")} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 pb-4 mt-auto text-xs text-muted-foreground">
        <div className="rounded-md bg-muted/70 p-3">
          <p>
            Built with ❤️ by <a className="underline hover:text-foreground" href="https://github.com/utachicodes" target="_blank" rel="noreferrer">utachicodes</a>
          </p>
          <p>
            Support: <a className="underline" href="mailto:abdoullahaljersi@gmail.com">abdoullahaljersi@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden md:pl-64">
        {/* Top bar */}
        <div className="h-16 border-b bg-card/60 backdrop-blur flex items-center px-4 sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <SimpleThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => location.assign('/settings')}>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-in fade-in-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
