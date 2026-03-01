import { BusinessService } from "@/src/lib/business-service"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  Plus,
  ChevronRight,
  UtensilsCrossed,
  MoreHorizontal,
  LayoutGrid
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function BusinessesPage() {
  let restaurants: any[] = []
  let error = null

  try {
    restaurants = await BusinessService.getAllBusinesses()
  } catch (e: any) {
    console.error("Failed to load restaurants:", e)
    error = e.message || "Failed to load"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your restaurants and chatbot settings
          </p>
        </div>
        <Button asChild className="rounded-lg h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/onboarding" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Business
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          Failed to load businesses: {error}
        </div>
      )}

      {restaurants.length === 0 && !error ? (
        <Card className="border-2 border-dashed border-border flex flex-col items-center justify-center p-16 text-center">
          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <Store className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No businesses yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Add your first restaurant to start taking orders via WhatsApp.
          </p>
          <Button asChild className="rounded-lg bg-primary text-primary-foreground">
            <Link href="/onboarding">Add Your First Business</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Card key={res.id} className="border border-border bg-card hover:border-primary/30 transition-colors group">
              <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {res.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {res.cuisine || "Business"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/businesses/${res.id}`}>Open</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Analytics</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-5 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full text-xs font-medium",
                      res.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {res.isActive ? "Online" : "Paused"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">Menu Items</p>
                    <div className="flex items-center gap-1.5">
                      <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold">{(res as any).menu?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                    <div className="flex items-center gap-1.5">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-semibold">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-2">
                <Button asChild variant="outline" className="w-full h-9 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <Link href={`/dashboard/businesses/${res.id}`} className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">Manage</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Link href="/onboarding" className="group">
            <Card className="h-full border-2 border-dashed border-border hover:border-primary/30 transition-colors flex flex-col items-center justify-center p-10 min-h-[280px] cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <p className="font-medium text-foreground mb-0.5 group-hover:text-primary transition-colors">Add New Business</p>
              <p className="text-xs text-muted-foreground text-center max-w-[180px]">Expand by adding another restaurant or location.</p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
