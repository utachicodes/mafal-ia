import { ChatSimulator } from "@/src/components/chat-simulator"
import { RestaurantService } from "@/src/lib/restaurant-service"

export default async function PlaygroundPage() {
  const restaurants = await RestaurantService.getAllRestaurants()
  const simpleRestaurants = restaurants.map(r => ({ id: r.id, name: r.name }))

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Playground</h1>
        <p className="text-muted-foreground">
          Test your agents in real-time without WhatsApp. Note: Persisted to DB.
        </p>
      </div>

      <ChatSimulator restaurants={simpleRestaurants} />
    </div>
  )
}
