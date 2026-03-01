"use client"

import { ReactNode } from "react"
import { PlatformLayout } from "@/src/components/platform/PlatformLayout"

interface PlaygroundLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: PlaygroundLayoutProps) {
  return (
    <PlatformLayout>
      {children}
    </PlatformLayout>
  )
}
