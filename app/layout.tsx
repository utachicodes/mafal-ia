import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Providers } from "./providers"
import { metadata } from "./metadata"
import { LanguageProvider } from "@/src/context/language-context"
import { LanguageWrapper } from "./language-wrapper"
import { I18nProvider } from "@/src/context/i18n"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackServerApp } from "@/src/stack"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LanguageProvider>
      <LanguageWrapper>
        <head>
          <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
          `}</style>
        </head>
        <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <I18nProvider>
                <Providers>
                  {children}
                </Providers>
              </I18nProvider>
            </StackTheme>
          </StackProvider>
        </body>
      </LanguageWrapper>
    </LanguageProvider>
  )
}
