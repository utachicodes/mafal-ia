import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RestaurantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <p className="text-muted-foreground">
          Manage your restaurant locations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Restaurants</CardTitle>
          <CardDescription>List of all your restaurant locations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No restaurants found.</p>
        </CardContent>
      </Card>
    </div>
  )
}
