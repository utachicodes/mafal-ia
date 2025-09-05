"use client"

import DashboardLayout from "@/src/components/dashboard-layout"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Restaurant } from "@/lib/data"
import { LocalStorage } from "@/src/lib/storage"

const ChatAnalytics = dynamic(
  () => import("@/src/components/restaurant/chat-analytics").then((m) => m.ChatAnalytics),
  { ssr: false },
)

export default function AnalyticsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("")
  
  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored as Restaurant[])
      } else {
        // setRestaurants(mockRestaurants) // Removed mock data usage
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (restaurants.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Create a restaurant first to view analytics.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor your chatbot performance and customer interactions</p>
          </div>
          {restaurants.length > 1 && (
            <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedRestaurant && <ChatAnalytics restaurant={selectedRestaurant} />}
      </div>
    </DashboardLayout>
  )
}
