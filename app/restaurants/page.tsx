"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Store, Calendar, ExternalLink, Globe, Phone } from "lucide-react"
import Link from "next/link"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import { DashboardLayout } from "@/src/components/dashboard-layout"
// Creation is unified via onboarding; no quick-add dialog

function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={restaurant.isActive ? "default" : "secondary"}
              className={restaurant.isActive ? "bg-green-600" : ""}
            >
              {restaurant.isActive ? "Active" : "Inactive"}
            </Badge>
            <Link href={`/restaurants/${restaurant.id}`}>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{restaurant.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{restaurant.whatsappNumber || "No WhatsApp number"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{restaurant.supportedLanguages?.join(", ") || "English"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(restaurant.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{restaurant.menu?.length || 0}</span> menu items
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No restaurants yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Get started by creating your first restaurant profile and setting up your WhatsApp chatbot.
      </p>
      <Link href="/onboarding">
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Start Onboarding
        </Button>
      </Link>
    </div>
  )
}

export default function RestaurantsPage() {
  const { restaurants, isLoading } = useRestaurants()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading restaurants...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Restaurants</h1>
            <p className="text-muted-foreground">Manage your restaurant profiles and WhatsApp chatbots</p>
          </div>
          {restaurants.length > 0 && (
            <Link href="/onboarding">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Restaurant
              </Button>
            </Link>
          )}
        </div>

        {restaurants.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* All creation flows go through /onboarding */}
      </div>
    </DashboardLayout>
  )
}
