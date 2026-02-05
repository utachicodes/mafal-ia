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
  Activity
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
            <Store className="h-10 w-10" /> My Restaurants
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Manage your AI-powered locations and their specialized menus.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2">
          <Link href="/onboarding">
            <Plus className="h-5 w-5" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      {restaurants.length === 0 ? (
        <Card className="glass flex flex-col items-center justify-center p-20 border-dashed border-2 border-primary/20 bg-white/5 dark:bg-black/5 rounded-3xl">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black mb-2">No restaurants found</CardTitle>
          <CardDescription className="text-lg text-center max-w-md mb-8 font-medium">
            You haven't added any restaurants to your portfolio yet. Let's get started by adding your first location.
          </CardDescription>
          <Button asChild size="lg" className="rounded-full px-12 py-6 h-auto text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Card key={res.id} className="group glass card-hover border-none shadow-xl overflow-hidden flex flex-col bg-white/50 dark:bg-black/20 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-4 border-none bg-transparent pt-8 px-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight">{res.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-70">
                      <MapPin className="h-3 w-3 text-primary" />
                      {res.cuisine || "International"}
                    </div>
                  </div>
                  <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest border-none ${res.isActive ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : "bg-neutral-500/10 text-neutral-500"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${res.isActive ? "bg-green-500 animate-pulse" : "bg-neutral-500"}`} />
                    {res.isActive ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-6 border-none px-8 pb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Menu Size</span>
                    </div>
                    <p className="text-2xl font-black">{(res as any).menu?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Response Rate</span>
                    </div>
                    <p className="text-sm font-bold text-blue-500 flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Active
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full rounded-2xl gap-2 font-black py-6 h-auto group/btn bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all border-none" variant="ghost">
                  <Link href={`/restaurants/${res.id}`}>
                    Manage Location
                    <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          <Link href="/onboarding" className="group h-full">
            <Card className="glass border-dashed border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-12 h-full min-h-[300px] hover:border-primary/50 transition-all rounded-3xl group">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                <Plus className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <p className="text-xl font-black text-primary text-center">Add New Location</p>
              <p className="text-sm text-muted-foreground text-center mt-2 font-medium max-w-[200px]">Scale your business across West Africa</p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
