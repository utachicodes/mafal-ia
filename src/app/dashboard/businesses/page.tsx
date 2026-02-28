import { BusinessService } from "@/src/lib/business-service"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  Plus,
  ChevronRight,
  UtensilsCrossed,
  MapPin,
  MoreHorizontal,
  CircleDot,
  LayoutGrid
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
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-gradient py-2">
            Businesses
          </h1>
          <p className="text-muted-foreground text-lg font-medium opacity-70">
            Manage your restaurants and chatbot settings
          </p>
        </div>
        <Button asChild className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
          <Link href="/onboarding" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Business
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
          <CircleDot className="h-5 w-5 animate-pulse" />
          Failed to load businesses: {error}
        </div>
      )}

      {restaurants.length === 0 && !error ? (
        <Card className="glass border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-20 text-center group">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Store className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No businesses yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Add your first restaurant to start taking orders via WhatsApp.
          </p>
          <Button asChild className="rounded-xl px-8 h-12 bg-primary text-white shadow-lg">
            <Link href="/onboarding">Add Your First Business</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Card key={res.id} className="glass border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden group shadow-xl neural-border">
              <div className="h-2 bg-primary/5 transition-colors group-hover:bg-primary/20" />
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {res.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-widest">
                      <MapPin className="h-3 w-3 text-primary" />
                      {res.cuisine || "Business"}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 transition-all opacity-40 group-hover:opacity-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-white/10">
                      <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest px-4 py-2">Manage</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg mx-1">
                        <Link href={`/dashboard/businesses/${res.id}`}>Open</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg mx-1">
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5 mx-1 my-1" />
                      <DropdownMenuItem className="px-4 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer rounded-lg mx-1 font-bold">
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</span>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2",
                    res.isActive
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_-2px_theme(colors.emerald.500)]"
                      : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                  )}>
                    {res.isActive ? "Online" : "Paused"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Menu Items</p>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      <span className="text-lg font-bold">{(res as any).menu?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
                      <span className="text-lg font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-2">
                <Button asChild variant="outline" className="w-full h-12 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                  <Link href={`/dashboard/businesses/${res.id}`} className="flex items-center justify-between w-full px-2">
                    <span className="font-bold uppercase tracking-widest text-xs">Manage</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Link href="/onboarding" className="group">
            <Card className="h-full border-dashed border-2 border-white/10 glass shadow-none hover:border-primary/50 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center p-12 min-h-[300px] cursor-pointer rounded-[2rem]">
              <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 border border-white/5 transition-all group-hover:scale-110 duration-500">
                <Plus className="h-8 w-8" />
              </div>
              <p className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">Add New Business</p>
              <p className="text-xs text-muted-foreground text-center max-w-[180px] leading-relaxed">Expand by adding another restaurant or location.</p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
