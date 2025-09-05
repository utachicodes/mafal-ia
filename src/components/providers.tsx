"use client"

import { ThemeProvider } from "./theme-provider"
import { useEffect, useState } from "react"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <RestaurantsProvider>
          {children}
        </RestaurantsProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
