import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { LanguageProvider } from "@/src/context/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mafal-IA | Restaurant WhatsApp Chatbot Platform",
  description: "Create and manage intelligent, multilingual WhatsApp chatbots for your restaurant",
  icons: {
    icon: "/mafalia-logo-svg.svg",
    shortcut: "/mafalia-logo-svg.svg",
    apple: "/mafalia-logo-svg.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/20`}>
        <LanguageProvider>
          <Providers>
            {children}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
