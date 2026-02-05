"use client"

import { ReactNode } from "react"
import DashboardLayout from '@/src/components/dashboard-layout'

interface OnboardingLayoutProps {
    children: ReactNode
}

export default function Layout({ children }: OnboardingLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </div>
    )
}
