import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Settings,
    ArrowLeft,
    Save,
    Trash2,
    Store,
    Activity,
} from "lucide-react"
import Link from "next/link"
import { BusinessService } from "@/src/lib/business-service"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

interface BusinessSettingsPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessSettingsPage({ params }: BusinessSettingsPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

    if (!restaurant) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-3 mb-1 text-muted-foreground hover:text-foreground">
                        <Link href={`/dashboard/businesses/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Configuration for {restaurant.name}
                    </p>
                </div>
                <Button className="rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Business Details */}
                <Card className="border border-border bg-card">
                    <CardHeader className="border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Business Details</CardTitle>
                                <CardDescription>Basic information about your business</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                                <Input
                                    defaultValue={restaurant.name}
                                    className="h-10 bg-muted border-border rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Cuisine / Category</label>
                                <Input
                                    defaultValue={restaurant.cuisine}
                                    className="h-10 bg-muted border-border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <Textarea
                                defaultValue={restaurant.description || ""}
                                placeholder="Describe your business..."
                                className="rounded-lg bg-muted border-border h-24 resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Business Status</p>
                                    <p className="text-xs text-muted-foreground">Toggle visibility for customers</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className={cn(
                                    "rounded-lg text-sm font-medium",
                                    restaurant.isActive
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                        : "bg-muted text-muted-foreground border-border"
                                )}
                            >
                                {restaurant.isActive ? "Active" : "Inactive"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border border-destructive/20 bg-card">
                    <CardHeader className="border-b border-destructive/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for this business</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="font-medium text-sm">Delete Business</p>
                            <p className="text-sm text-muted-foreground">All menu data, chat history, and orders will be permanently deleted.</p>
                        </div>
                        <Button variant="destructive" className="rounded-lg gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
