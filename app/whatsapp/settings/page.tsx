"use client"

import DashboardLayout from "@/src/components/dashboard-layout"

export default function DisabledWhatsAppSettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-3">Integration Settings</h1>
        <p className="text-muted-foreground">
          Messaging provider-specific settings are disabled in this build. Use your restaurant's
          chatbot API endpoint to integrate with your provider/webhook.
        </p>
        <div className="mt-6 rounded border p-4 bg-card">
          <p className="text-sm">
            After onboarding, copy your endpoint at <code>/api/chatbots/[restaurantId]/messages</code>
            and configure your external webhook to POST events there.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}