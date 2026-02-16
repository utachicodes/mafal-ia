"use client"

import { ReactNode } from "react"
import { PlatformLayout } from "@/src/components/platform/PlatformLayout"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <PlatformLayout>
      {children}
    </PlatformLayout>
  )
}
