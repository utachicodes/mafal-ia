"use client"

import DashboardLayout from "@/src/components/dashboard-layout"

export default function ToolsProviderDisabledPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-3">Messaging Tools</h1>
        <p className="text-muted-foreground">
          Provider-specific tools are disabled in this build. Use your restaurant’s chatbot endpoint instead:
        </p>
        <pre className="mt-4 p-3 rounded bg-muted text-sm overflow-auto">/api/chatbots/[restaurantId]/messages</pre>
        <p className="text-sm text-muted-foreground mt-2">POST a JSON body like {`{ "from": "<user>", "text": "<message>" }`}.</p>
      </div>
    </DashboardLayout>
  )
}
