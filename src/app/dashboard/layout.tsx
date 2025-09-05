"use client"

import { ReactNode } from "react"
import dynamic from 'next/dynamic'

// Import the DashboardLayout component directly
import DashboardLayout from '../../components/dashboard-layout'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  )
}
