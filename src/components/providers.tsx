"use client"

import { ThemeProvider } from "./theme-provider"
import { useEffect, useState } from "react"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { I18nProvider } from "@/src/context/i18n"

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
    <ThemeProvider>
      <ErrorBoundary>
        <RestaurantsProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </RestaurantsProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
