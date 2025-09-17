import { NextResponse } from "next/server"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { AIClient } from "@/src/lib/ai-client"
import { extractApiKeyFromHeaders, validateApiKey } from "@/src/lib/api-auth"

export async function POST(req: Request) {
  try {
    // Require a valid API key
    const key = extractApiKeyFromHeaders(req.headers)
    if (!key) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 })
    }
    const validation = await validateApiKey(key)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason || "Invalid API key" }, { status: 401 })
    }

    const body = await req.json()
    const { message, restaurantId, language = "English" } = body || {}

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      )
    }

    // Ensure the API key belongs to this restaurant
    if (validation.restaurantId && restaurantId && validation.restaurantId !== restaurantId) {
      return NextResponse.json({ error: "API key does not match restaurant" }, { status: 403 })
    }

    // Find restaurant by ID (from request or from key)
    const targetRestaurantId = restaurantId || validation.restaurantId
    if (!targetRestaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 })
    }

    const restaurant = await RestaurantService.getRestaurantById(targetRestaurantId)
    
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    // Generate AI response using the restaurant's context
    const messages = [
      { id: `m_${Date.now()}`, role: "user" as const, content: String(message), timestamp: new Date() },
    ]
    const response = await AIClient.generateResponse(
      messages,
      `${restaurant.chatbotContext.welcomeMessage}\n${restaurant.chatbotContext.specialInstructions}`,
      restaurant.menu,
      restaurant.name,
    )

    return NextResponse.json({
      response: response.response,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine
      },
      language: (response as any).detectedLanguage || language
    })

  } catch (error) {
    console.error("AI Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Mafal-IA Chat API",
    usage: {
      endpoint: "POST /api/ai/chat",
      headers: { "Content-Type": "application/json" },
      body: {
        restaurantId: "<your-restaurant-id>",
        message: "Hello, I'd like to see your menu",
        language: "English" // optional, defaults to English
      }
    }
  })
}
