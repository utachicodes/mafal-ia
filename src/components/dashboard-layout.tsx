"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/src/context/language-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Menu, Home, Store, BarChart3, Settings, MessageSquare, Key } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  const { language, setLanguage } = useLanguage()
  
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
      <div className="p-6 pb-2">
        <div className="h-6 text-foreground">
          <Logo />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 pb-4 mt-auto text-xs text-muted-foreground">
        <div className="rounded-md bg-muted p-3">
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
        <div className="flex flex-col flex-grow border-r bg-card">
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
        <div className="h-16 border-b bg-card/50 backdrop-blur flex items-center px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            <Select defaultValue={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
