"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiKeyDisplayProps {
  restaurant: {
    id: string
    name: string
  }
}

export function ApiKeyDisplay({ restaurant }: ApiKeyDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>External API Access</CardTitle>
        <CardDescription>
          API keys are no longer used. Integrations should go through the WhatsApp webhook.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          For {restaurant.name}, configure WhatsApp credentials and the webhook in the "API Credentials" section.
        </p>
      </CardContent>
    </Card>
  )
}
