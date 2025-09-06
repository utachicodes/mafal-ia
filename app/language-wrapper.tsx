"use client"

import { useLanguage } from "@/src/context/language-context"

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  return (
    <html lang={language} className="dark" suppressHydrationWarning>
      {children}
    </html>
  )
}