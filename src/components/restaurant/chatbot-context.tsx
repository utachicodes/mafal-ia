"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import type { Restaurant } from "@/lib/data"

interface ChatbotContextProps {
  restaurant: Restaurant
}

export function ChatbotContext({ restaurant }: ChatbotContextProps) {
  const [context, setContext] = useState(restaurant.context)
  const [isLoading, setIsLoading] = useState(false)
  const { updateRestaurant } = useRestaurants()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      updateRestaurant(restaurant.id, { context: context.trim() })
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = context !== restaurant.context

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Context</CardTitle>
        <CardDescription>
          Provide context and instructions for your WhatsApp chatbot. This helps the AI understand your restaurant's
          policies, hours, and special information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter context for your chatbot (e.g., opening hours, policies, special offers, etc.)"
            rows={10}
            className="resize-none"
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{context.length} characters</p>
            <Button type="submit" disabled={!hasChanges || isLoading} className="min-w-[100px]">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Context
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
