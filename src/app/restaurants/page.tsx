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
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const dynamic = "force-dynamic"

export default async function RestaurantsPage() {
  const restaurants = await RestaurantService.getAllRestaurants()

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Restaurants
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your locations and menus.
          </p>
        </div>
        <Button asChild className="h-9 gap-2">
          <Link href="/onboarding">
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      {restaurants.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed shadow-sm bg-gray-50/50 dark:bg-gray-900/50">
          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-500">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No restaurants yet</h3>
          <p className="text-sm text-gray-500 text-center max-w-sm mb-6 mt-1">
            Get started by adding your first restaurant location to the platform.
          </p>
          <Button asChild variant="outline">
            <Link href="/onboarding">Create Restaurant</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Card key={res.id} className="group shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-950">
              <CardHeader className="pb-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {res.name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {res.cuisine || "General Cuisine"}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/restaurants/${res.id}`}>Manage</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Menu</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <Badge variant={res.isActive ? "default" : "secondary"} className={res.isActive ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50" : ""}>
                    {res.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Items</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-red-500/70" />
                      {(res as any).menu?.length || 0}
                    </p>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Health</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Store className="h-4 w-4 text-green-500/70" />
                      100%
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full justify-between group-hover:border-red-200 dark:group-hover:border-red-900/50 group-hover:bg-red-50/50 dark:group-hover:bg-red-900/10 transition-all">
                  <Link href={`/restaurants/${res.id}`}>
                    <span className="font-medium group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">Manage Details</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Link href="/onboarding" className="group h-full">
            <Card className="h-full border-dashed border-2 border-gray-200 dark:border-gray-800 shadow-none hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50/10 dark:hover:bg-red-900/10 transition-all flex flex-col items-center justify-center p-6 min-h-[250px] cursor-pointer">
              <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all group-hover:scale-110 duration-300 shadow-sm group-hover:shadow-md">
                <Plus className="h-7 w-7" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Add New Location</p>
              <p className="text-sm text-gray-500 text-center mt-2 max-w-[200px]">Expand your business by adding a new restaurant branch</p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
