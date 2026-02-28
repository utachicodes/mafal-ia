"use client"

import { ThemeProvider } from "./theme-provider"
import { BusinessesProvider } from "@/src/hooks/use-businesses"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { I18nProvider } from "@/src/context/i18n"
// import { SessionProvider } from "next-auth/react" // Auth disabled
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BusinessesProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </BusinessesProvider>
      </ErrorBoundary>
      <Toaster />
    </ThemeProvider>
  )
}
