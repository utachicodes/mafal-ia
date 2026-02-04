"use client"

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      {children}
    </html>
  )
}