import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mafal IA",
  description: "AI-powered restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = cookies().get("lang")?.value ?? "en";
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}><StackProvider app={stackServerApp}><StackTheme>
        <Providers>
          {children}
        </Providers>
      </StackTheme></StackProvider></body>
    </html>
  );
}
