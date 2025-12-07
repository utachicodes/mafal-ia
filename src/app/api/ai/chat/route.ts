import { type NextRequest, NextResponse } from "next/server"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { AIClient } from "@/src/lib/ai-client"
import { z } from "zod"

const requestSchema = z.object({
    restaurantId: z.string(),
    message: z.string(),
    sessionId: z.string().optional(), // For web testing, we can generate a random session ID
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { restaurantId, message, sessionId } = requestSchema.parse(body)

        const restaurant = await RestaurantService.getRestaurantById(restaurantId)
        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
        }

        // Use a unique session ID for this web chat (e.g. "web_123")
        // If not provided, assume a ephemeral test session
        const effectiveSessionId = sessionId || `web_test_${Date.now()}`

        // 1. Add User Message
        await ConversationManager.addMessage(restaurantId, effectiveSessionId, {
            id: `msg_${Date.now()}`,
            role: "user",
            content: message,
            timestamp: new Date()
        })

        // 2. Load History & Context
        const history = await ConversationManager.getConversation(restaurantId, effectiveSessionId)

        // Normalize Menu
        const menu = (restaurant.menu || []).map((m: any, idx: number) => ({
            id: String(m.id ?? idx + 1),
            name: String(m.name ?? "Item"),
            description: String(m.description ?? ""),
            price: Number(m.price ?? 0),
            category: m.category ? String(m.category) : undefined,
            isAvailable: m.isAvailable ?? true,
        }))

        const context = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Hours: ${restaurant.chatbotContext?.businessHours || "Not specified"}
Delivery: ${restaurant.chatbotContext?.deliveryInfo || "Available"}
Channel: Web Simulator
    `.trim()

        // 3. Generate Response
        const aiResponse = await AIClient.generateResponse(history, context, menu, restaurant.name)

        // 4. Save Assistant Response
        await ConversationManager.addMessage(restaurantId, effectiveSessionId, {
            id: `ai_${Date.now()}`,
            role: "assistant",
            content: aiResponse.response,
            timestamp: new Date()
        })

        return NextResponse.json({
            response: aiResponse.response,
            orderQuote: aiResponse.orderQuote,
            sessionId: effectiveSessionId
        })

    } catch (error) {
        console.error("[API/AI/Chat] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
