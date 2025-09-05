"use client"

import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Store } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { type Restaurant, mockRestaurants } from "@/lib/data"
import { LocalStorage } from "@/src/lib/storage"
import DashboardLayout from "@/src/components/dashboard-layout"
import { GeneralSettings } from "@/src/components/restaurant/general-settings"
import { MenuManager } from "@/src/components/restaurant/menu-manager"
import { ChatbotContext } from "@/src/components/restaurant/chatbot-context"
import { ChatbotLiveView } from "@/src/components/restaurant/chatbot-live-view"
import { ApiCredentials } from "@/src/components/restaurant/api-credentials"

export default function RestaurantDetailPage() {
  const params = useParams()
  const restaurantId = params.id as string
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored as Restaurant[])
      } else {
        setRestaurants(mockRestaurants)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])
  
  const getRestaurantById = (id: string) => {
    return restaurants.find((restaurant) => restaurant.id === id)
  }
  
  const restaurant = getRestaurantById(restaurantId)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading restaurant...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Restaurant not found</h3>
          <p className="text-muted-foreground mb-6">
            The restaurant you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/restaurants">
            <Button className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Restaurants
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/restaurants">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <Badge
                  variant={restaurant.isActive ? "default" : "secondary"}
                  className={restaurant.isActive ? "bg-green-600" : ""}
                >
                  {restaurant.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{restaurant.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.supportedLanguages?.join(", ") || "English"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="live">Live View</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings restaurant={restaurant} />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManager restaurant={restaurant} />
          </TabsContent>

          <TabsContent value="context">
            <ChatbotContext restaurant={restaurant} />
          </TabsContent>

          <TabsContent value="live">
            <ChatbotLiveView restaurant={restaurant} />
          </TabsContent>

          <TabsContent value="api">
            <ApiCredentials restaurant={restaurant} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
