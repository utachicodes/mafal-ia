import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Store, ExternalLink } from "lucide-react"
import { RestaurantService } from "@/src/lib/restaurant-service"

export default async function RestaurantsPage() {
  const restaurants = await RestaurantService.getAllRestaurants()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground">
            Manage your restaurant locations and menus
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/onboarding">
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-muted/40 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="line-clamp-1">{restaurant.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{restaurant.cuisine}</CardDescription>
                  </div>
                </div>
                <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                  {restaurant.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-2 text-sm text-neutral-600 mb-6">
                <div className="flex justify-between">
                  <span>Menu Items</span>
                  <span className="font-medium">{restaurant.menu.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp</span>
                  <span className="font-medium">{restaurant.whatsappNumber || "Not Linked"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="w-full" variant="default">
                  <Link href={`/restaurants/${restaurant.id}`}>Manage</Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link href={`/restaurants/${restaurant.id}/preview`} title="Preview Chat">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {restaurants.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
            <Store className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No restaurants yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first restaurant.</p>
            <Button asChild>
              <Link href="/onboarding">Create Restaurant</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
