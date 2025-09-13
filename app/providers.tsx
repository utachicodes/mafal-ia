'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { UserProvider } from "@/src/context/user-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <UserProvider>
          <ErrorBoundary>
            <RestaurantsProvider>{children}</RestaurantsProvider>
          </ErrorBoundary>
        </UserProvider>
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  )
}
