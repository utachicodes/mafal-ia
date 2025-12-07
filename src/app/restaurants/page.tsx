import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Store, ExternalLink, Sparkles } from "lucide-react"
import { RestaurantService } from "@/src/lib/restaurant-service"

export default async function RestaurantsPage() {
  const restaurants = await RestaurantService.getAllRestaurants()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" /> Restaurants
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant locations and AI menus
          </p>
        </div>
        <Button asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
          <Link href="/onboarding">
            <Plus className="h-4 w-4" />
            New Location
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="group card-hover overflow-hidden border-muted/60">
            <CardHeader className="bg-gradient-to-br from-muted/50 to-muted/10 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 text-primary">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="line-clamp-1 text-lg">{restaurant.name}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs uppercase tracking-wider font-medium text-primary/80">
                      {restaurant.cuisine}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={restaurant.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-100"}>
                  {restaurant.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{restaurant.menu.length}</div>
                  <div className="text-xs text-muted-foreground">Items</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {restaurant.whatsappNumber ? "Link" : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">WhatsApp</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="w-full font-medium" variant="default">
                  <Link href={`/restaurants/${restaurant.id}`}>Manage Restaurant</Link>
                </Button>
                <Button asChild variant="outline" size="icon" className="shrink-0 aspect-square">
                  <Link href={`/restaurants/${restaurant.id}/preview`} title="Preview Chat">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {restaurants.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-card/50 text-center animate-in fade-in-50">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No restaurants yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">Get started by creating your first restaurant location to begin automating orders.</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/onboarding">Create Your First Restaurant</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
