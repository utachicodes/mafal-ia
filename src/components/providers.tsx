"use client"

import { ThemeProvider } from "./theme-provider"
import { useEffect, useState } from "react"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { I18nProvider } from "@/src/context/i18n"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <RestaurantsProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </RestaurantsProvider>
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
