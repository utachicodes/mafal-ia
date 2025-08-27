"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { AuthProvider } from "./auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ErrorBoundary>
          <RestaurantsProvider>{children}</RestaurantsProvider>
        </ErrorBoundary>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
