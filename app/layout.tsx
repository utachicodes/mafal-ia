import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Providers } from "./providers"
import { metadata } from "./metadata"
import { LanguageProvider } from "@/src/context/language-context"
import { LanguageWrapper } from "./language-wrapper"

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
          <Providers>
            {children}
          </Providers>
        </body>
      </LanguageWrapper>
    </LanguageProvider>
  )
}
