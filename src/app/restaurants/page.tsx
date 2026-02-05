import { RestaurantService } from "@/src/lib/restaurant-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  Plus,
  ChevronRight,
  MessageSquare,
  UtensilsCrossed,
  MapPin,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function RestaurantsPage() {
  const restaurants = await RestaurantService.getAllRestaurants()

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient flex items-center gap-3">
            <Store className="h-10 w-10 text-primary" /> My Restaurants
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your AI-powered locations and their specialized menus.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2">
          <Link href="/onboarding">
            <Plus className="h-5 w-5" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      {restaurants.length === 0 ? (
        <Card className="glass flex flex-col items-center justify-center p-20 border-dashed border-2 bg-muted/5">
          <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Store className="h-12 w-12 text-primary/40" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">No restaurants found</CardTitle>
          <CardDescription className="text-lg text-center max-w-md mb-8">
            You haven't added any restaurants to your portfolio yet. Let's get started by adding your first location.
          </CardDescription>
          <Button asChild size="lg" className="rounded-full px-12">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Card key={res.id} className="group glass card-hover border-none shadow-xl overflow-hidden flex flex-col">
              <div className="h-3 w-full bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-4 border-none bg-transparent">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{res.name}</CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium uppercase tracking-wider">
                      <MapPin className="h-3 w-3" />
                      {res.cuisine || "International"}
                    </div>
                  </div>
                  <Badge variant="outline" className={res.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-neutral-500/10 text-neutral-500"}>
                    {res.isActive ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 border-none">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <UtensilsCrossed className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Menu</span>
                    </div>
                    <p className="text-lg font-bold">{(res as any).menu?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3 w-3 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chat</span>
                    </div>
                    <p className="text-lg font-bold">Active</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/10 bg-muted/20 mt-auto">
                <Button asChild className="w-full rounded-xl gap-2 font-bold group" variant="ghost">
                  <Link href={`/restaurants/${res.id}`}>
                    Manage Location
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Link href="/onboarding" className="group h-full">
            <Card className="glass border-dashed border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-12 h-full hover:border-primary/50 transition-all">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="font-bold text-primary text-center">Add New Location</p>
              <p className="text-xs text-muted-foreground text-center mt-1">Scale your business across West Africa</p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
