"use client"

import DashboardLayout from "@/src/components/dashboard-layout"

export default function QuickConnectDisabledPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-3">Quick Connect</h1>
        <p className="text-muted-foreground">
          Provider quick-connect is disabled in this build. To receive messages, point your external webhook to your
          restaurant’s chatbot endpoint at <code>/api/chatbots/[businessId]/messages</code> and POST payloads
          like <code>{`{ "from": "<user>", "text": "<message>" }`}</code>.
        </p>
      </div>
    </DashboardLayout>
  )
}
