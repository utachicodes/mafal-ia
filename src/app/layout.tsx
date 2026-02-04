import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { LanguageProvider } from "@/src/context/language-context";
import { LanguageWrapper } from "./language-wrapper";

const inter = Inter({ subsets: ["latin"] });

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
    <LanguageProvider>
      <LanguageWrapper>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <Providers>
              {children}
            </Providers>
          </body>
        </html>
      </LanguageWrapper>
    </LanguageProvider>
  );
}
