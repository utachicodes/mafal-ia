"use client"

import { ThemeProvider } from "./theme-provider"
import { useEffect, useState } from "react"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { LanguageProvider } from "@/src/context/language-context"
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <RestaurantsProvider>
          <LanguageProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </LanguageProvider>
        </RestaurantsProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
